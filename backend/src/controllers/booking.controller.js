const Booking = require('../models/Booking.model');
const Package = require('../models/Package.model');
const User = require('../models/User.model');
const { Notification } = require('../models/index.models');
const { sendEmail } = require('../utils/email.util');

// ─── @POST /api/bookings ────────────────────────────────────
exports.createBooking = async (req, res, next) => {
  try {
    const {
      packageId, travelDate, travelers, leadTraveler,
      specialRequests, addOns, emergencyContact,
    } = req.body;

    const pkg = await Package.findById(packageId);
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    if (!pkg.isActive) return res.status(400).json({ success: false, message: 'Package is not available for booking' });

    const totalGuests = (travelers.adults || 1) + (travelers.children || 0);
    if (totalGuests > pkg.groupSize.max) {
      return res.status(400).json({ success: false, message: `Maximum group size is ${pkg.groupSize.max}` });
    }

    // Calculate pricing
    const adultTotal = pkg.price.adult * (travelers.adults || 1);
    const childTotal = (pkg.price.child || 0) * (travelers.children || 0);
    const addOnTotal = (addOns || []).reduce((sum, a) => sum + a.price * (a.quantity || 1), 0);
    const subtotal = adultTotal + childTotal + addOnTotal;
    const taxes = Math.round(subtotal * 0.05); // 5% tax
    const total = subtotal + taxes;
    const depositAmount = Math.round(total * (pkg.depositRequired / 100));
    const balanceDue = total - depositAmount;
    const balanceDueDate = new Date(travelDate);
    balanceDueDate.setDate(balanceDueDate.getDate() - 30); // 30 days before travel

    const booking = await Booking.create({
      user: req.user.id,
      package: packageId,
      travelDate: new Date(travelDate),
      travelers,
      leadTraveler,
      emergencyContact,
      specialRequests,
      addOns: addOns || [],
      pricing: {
        adultPrice: pkg.price.adult,
        childPrice: pkg.price.child || 0,
        subtotal,
        taxes,
        total,
        currency: pkg.price.currency || 'USD',
        depositAmount,
        balanceDue,
        balanceDueDate,
      },
    });

    await booking.populate('package', 'title duration location coverImage');

    // Update package booking count
    await Package.findByIdAndUpdate(packageId, { $inc: { totalBookings: 1 } });

    // Create notification
    await Notification.create({
      user: req.user.id,
      type: 'booking_confirmed',
      title: 'Booking Received!',
      message: `Your booking for ${pkg.title} has been received. Reference: ${booking.bookingReference}`,
      data: { bookingId: booking._id, reference: booking.bookingReference },
      icon: '✈',
    });

    // Send confirmation email
    try {
      await sendEmail({
        to: leadTraveler.email,
        subject: `Booking Confirmation — ${pkg.title} [${booking.bookingReference}]`,
        template: 'bookingConfirmation',
        data: {
          name: leadTraveler.name,
          reference: booking.bookingReference,
          package: pkg.title,
          travelDate,
          guests: totalGuests,
          total: `$${total.toLocaleString()}`,
          deposit: `$${depositAmount.toLocaleString()}`,
        },
      });
    } catch (emailErr) {
      console.error('Booking email failed:', emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully!',
      booking,
    });
  } catch (err) {
    next(err);
  }
};

// ─── @GET /api/bookings/my ───────────────────────────────────
exports.getMyBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = { user: req.user.id };
    if (status) filter.status = status;
    const skip = (Number(page) - 1) * Number(limit);
    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate('package', 'title coverImage duration location category')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Booking.countDocuments(filter),
    ]);
    res.status(200).json({ success: true, count: bookings.length, total, bookings });
  } catch (err) {
    next(err);
  }
};

// ─── @GET /api/bookings/:id ──────────────────────────────────
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('package', 'title coverImage duration location highlights included')
      .populate('user', 'name email phone');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.user._id.toString() !== req.user.id && req.user.role === 'user') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
    }
    res.status(200).json({ success: true, booking });
  } catch (err) {
    next(err);
  }
};

// ─── @PATCH /api/bookings/:id/cancel ────────────────────────
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('package', 'title');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    if (['cancelled', 'completed'].includes(booking.status)) {
      return res.status(400).json({ success: false, message: `Booking cannot be cancelled (status: ${booking.status})` });
    }
    // Calculate refund (simplified)
    const daysToTravel = Math.ceil((new Date(booking.travelDate) - new Date()) / (1000 * 60 * 60 * 24));
    let refundPercent = 0;
    if (daysToTravel > 60) refundPercent = 90;
    else if (daysToTravel > 30) refundPercent = 50;
    else if (daysToTravel > 14) refundPercent = 25;
    const refundAmount = Math.round((booking.pricing.total * refundPercent) / 100);

    booking.status = 'cancelled';
    booking.cancellationReason = req.body.reason || 'Cancelled by traveller';
    booking.cancellationDate = new Date();
    booking.refundAmount = refundAmount;
    await booking.save();

    await Notification.create({
      user: booking.user,
      type: 'booking_cancelled',
      title: 'Booking Cancelled',
      message: `Your ${booking.package.title} booking has been cancelled. Refund: $${refundAmount}`,
      icon: '❌',
    });

    res.status(200).json({ success: true, message: 'Booking cancelled', refundAmount, booking });
  } catch (err) {
    next(err);
  }
};

// ─── @GET /api/bookings (admin) ─────────────────────────────
exports.getAllBookings = async (req, res, next) => {
  try {
    const { status, paymentStatus, startDate, endDate, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (startDate || endDate) {
      filter.travelDate = {};
      if (startDate) filter.travelDate.$gte = new Date(startDate);
      if (endDate) filter.travelDate.$lte = new Date(endDate);
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate('user', 'name email phone')
        .populate('package', 'title category location')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Booking.countDocuments(filter),
    ]);
    res.status(200).json({ success: true, count: bookings.length, total, totalPages: Math.ceil(total / Number(limit)), bookings });
  } catch (err) {
    next(err);
  }
};

// ─── @PATCH /api/bookings/:id/status ────────────────────────
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes, ...(status === 'confirmed' ? { confirmedAt: new Date(), confirmedBy: req.user.id } : {}) },
      { new: true }
    ).populate('user', 'name email').populate('package', 'title');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    await Notification.create({
      user: booking.user._id,
      type: 'booking_confirmed',
      title: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your ${booking.package.title} booking status has been updated to: ${status}`,
      icon: '📋',
    });

    res.status(200).json({ success: true, message: 'Status updated', booking });
  } catch (err) {
    next(err);
  }
};
