const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking.model');
const { Notification } = require('../models/index.models');
const User = require('../models/User.model');
const { sendEmail } = require('../utils/email.util');

// ─── @POST /api/payments/create-intent ─────────────────────
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { bookingId, paymentType } = req.body; // paymentType: 'deposit' | 'full'
    const booking = await Booking.findById(bookingId).populate('package', 'title');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const amount = paymentType === 'deposit'
      ? booking.pricing.depositAmount
      : booking.pricing.total - (booking.paymentStatus === 'deposit_paid' ? booking.pricing.depositAmount : 0);

    const amountInCents = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: (booking.pricing.currency || 'USD').toLowerCase(),
      metadata: {
        bookingId: booking._id.toString(),
        bookingReference: booking.bookingReference,
        userId: req.user.id,
        paymentType,
      },
      description: `${booking.package.title} — ${booking.bookingReference}`,
      receipt_email: req.user.email,
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount,
      currency: booking.pricing.currency,
    });
  } catch (err) {
    next(err);
  }
};

// ─── @POST /api/payments/confirm ────────────────────────────
exports.confirmPayment = async (req, res, next) => {
  try {
    const { bookingId, paymentIntentId, paymentType, method } = req.body;
    const booking = await Booking.findById(bookingId).populate('package', 'title').populate('user', 'name email');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    // Verify with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ success: false, message: 'Payment not completed' });
    }

    const amount = paymentIntent.amount / 100;

    booking.payments.push({
      amount,
      currency: booking.pricing.currency,
      method: method || 'card',
      stripePaymentIntentId: paymentIntentId,
      status: 'completed',
      paidAt: new Date(),
    });

    if (paymentType === 'deposit') {
      booking.paymentStatus = 'deposit_paid';
      booking.pricing.depositPaid = true;
      booking.status = 'confirmed';
    } else {
      booking.paymentStatus = 'fully_paid';
      booking.status = 'confirmed';
    }

    await booking.save();

    // Add loyalty points (1 pt per $10)
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { loyaltyPoints: Math.floor(amount / 10), totalSpent: amount },
    });

    // Notification
    await Notification.create({
      user: req.user.id,
      type: 'payment_received',
      title: 'Payment Confirmed',
      message: `Payment of $${amount.toLocaleString()} for ${booking.package.title} received.`,
      data: { bookingId: booking._id },
      icon: '💳',
    });

    // Receipt email
    try {
      await sendEmail({
        to: booking.user.email,
        subject: `Payment Receipt — ${booking.bookingReference}`,
        template: 'paymentReceipt',
        data: {
          name: booking.user.name,
          reference: booking.bookingReference,
          package: booking.package.title,
          amount: `$${amount.toLocaleString()}`,
          paymentType,
          date: new Date().toLocaleDateString(),
        },
      });
    } catch (e) { console.error('Receipt email failed:', e.message); }

    res.status(200).json({ success: true, message: 'Payment confirmed', booking });
  } catch (err) {
    next(err);
  }
};

// ─── @POST /api/payments/webhook ────────────────────────────
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const pi = event.data.object;
      console.log(`✅ Payment succeeded: ${pi.id} for booking ${pi.metadata.bookingId}`);
      break;
    }
    case 'payment_intent.payment_failed': {
      const pi = event.data.object;
      console.error(`❌ Payment failed: ${pi.id}`);
      break;
    }
    case 'charge.refunded': {
      const charge = event.data.object;
      console.log(`🔄 Charge refunded: ${charge.id}`);
      break;
    }
  }

  res.status(200).json({ received: true });
};

// ─── @POST /api/payments/refund ─────────────────────────────
exports.processRefund = async (req, res, next) => {
  try {
    const { bookingId, amount, reason } = req.body;
    const booking = await Booking.findById(bookingId).populate('user', 'name email');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    const lastPayment = booking.payments.find(p => p.status === 'completed' && p.stripePaymentIntentId);
    if (!lastPayment) return res.status(400).json({ success: false, message: 'No payment found to refund' });

    // Get charge from payment intent
    const pi = await stripe.paymentIntents.retrieve(lastPayment.stripePaymentIntentId);
    const refund = await stripe.refunds.create({
      charge: pi.latest_charge,
      amount: Math.round(amount * 100),
      reason: 'requested_by_customer',
    });

    booking.paymentStatus = 'refunded';
    booking.refundAmount = amount;
    await booking.save();

    await Notification.create({
      user: booking.user._id,
      type: 'payment_received',
      title: 'Refund Processed',
      message: `A refund of $${amount} has been processed. Allow 5–10 business days.`,
      icon: '🔄',
    });

    res.status(200).json({ success: true, message: `Refund of $${amount} processed`, refund });
  } catch (err) {
    next(err);
  }
};

// ─── @GET /api/payments/history ─────────────────────────────
exports.getPaymentHistory = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id, 'payments.0': { $exists: true } })
      .populate('package', 'title coverImage')
      .select('bookingReference package payments paymentStatus pricing')
      .sort('-createdAt')
      .lean();
    res.status(200).json({ success: true, bookings });
  } catch (err) {
    next(err);
  }
};
