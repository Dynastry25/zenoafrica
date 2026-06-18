const mongoose = require('mongoose');

const travelerSchema = new mongoose.Schema({
  type: { type: String, enum: ['adult', 'child', 'infant'], default: 'adult' },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: Date,
  nationality: String,
  passportNumber: String,
  passportExpiry: Date,
  dietaryRequirements: String,
  medicalConditions: String,
});

const bookingSchema = new mongoose.Schema({
  bookingReference: {
    type: String,
    unique: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  package: {
    type: mongoose.Schema.ObjectId,
    ref: 'Package',
    required: true,
  },

  // Booking details
  travelDate: { type: Date, required: true },
  returnDate: Date,
  travelers: {
    adults: { type: Number, required: true, min: 1 },
    children: { type: Number, default: 0 },
    infants: { type: Number, default: 0 },
  },
  travelerDetails: [travelerSchema],

  // Contact
  leadTraveler: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    nationality: String,
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
  },

  // Pricing
  pricing: {
    adultPrice: Number,
    childPrice: Number,
    subtotal: Number,
    taxes: { type: Number, default: 0 },
    discounts: { type: Number, default: 0 },
    total: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    depositAmount: Number,
    depositPaid: { type: Boolean, default: false },
    balanceDue: Number,
    balanceDueDate: Date,
  },

  // Payment
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'deposit_paid', 'fully_paid', 'refunded', 'partially_refunded'],
    default: 'unpaid',
  },
  payments: [{
    amount: Number,
    currency: String,
    method: { type: String, enum: ['card', 'bank_transfer', 'mobile_money', 'cash'] },
    stripePaymentIntentId: String,
    stripeChargeId: String,
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'] },
    paidAt: Date,
    receiptUrl: String,
    notes: String,
  }],

  // Booking status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded'],
    default: 'pending',
  },
  cancellationReason: String,
  cancellationDate: Date,
  refundAmount: Number,

  // Add-ons
  addOns: [{
    name: String,
    price: Number,
    quantity: { type: Number, default: 1 },
  }],

  // Special requests
  specialRequests: String,
  dietaryRequirements: String,
  roomPreferences: String,
  transferRequired: { type: Boolean, default: false },
  transferDetails: String,

  // Internal notes
  adminNotes: String,
  assignedGuide: { type: mongoose.Schema.ObjectId, ref: 'User' },

  // Visa
  visaRequired: { type: Boolean, default: false },
  visaStatus: { type: String, enum: ['not_required', 'pending', 'approved', 'rejected', ''] },

  // Confirmation
  confirmedAt: Date,
  confirmedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },

  // Email flags
  confirmationEmailSent: { type: Boolean, default: false },
  reminderEmailSent: { type: Boolean, default: false },
  reviewEmailSent: { type: Boolean, default: false },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// ─── Pre-save: Generate Reference ──────────────────────────
bookingSchema.pre('save', function (next) {
  if (!this.bookingReference) {
    const year = new Date().getFullYear().toString().slice(-2);
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    this.bookingReference = `ZAA-${year}-${random}`;
  }
  next();
});

// ─── Indexes ────────────────────────────────────────────────
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ package: 1 });
bookingSchema.index({ bookingReference: 1 });
bookingSchema.index({ travelDate: 1 });
bookingSchema.index({ status: 1, paymentStatus: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
