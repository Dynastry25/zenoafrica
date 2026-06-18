const mongoose = require('mongoose');

// ─── Review Model ───────────────────────────────────────────
const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  package: { type: mongoose.Schema.ObjectId, ref: 'Package', required: true },
  booking: { type: mongoose.Schema.ObjectId, ref: 'Booking' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true, trim: true, maxlength: 100 },
  comment: { type: String, required: true, maxlength: 2000 },
  categories: {
    guide: { type: Number, min: 1, max: 5 },
    accommodation: { type: Number, min: 1, max: 5 },
    value: { type: Number, min: 1, max: 5 },
    transport: { type: Number, min: 1, max: 5 },
  },
  photos: [{ url: String, public_id: String }],
  isVerified: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  helpfulVotes: { type: Number, default: 0 },
  adminReply: String,
  adminReplyDate: Date,
  travelDate: Date,
  travelType: { type: String, enum: ['solo', 'couple', 'family', 'group', 'business'] },
}, { timestamps: true });

reviewSchema.index({ package: 1, user: 1 }, { unique: true });
reviewSchema.index({ package: 1, isApproved: 1 });

// Update package average rating after review save
reviewSchema.post('save', async function () {
  const Package = mongoose.model('Package');
  const stats = await mongoose.model('Review').aggregate([
    { $match: { package: this.package, isApproved: true } },
    { $group: { _id: '$package', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  if (stats.length > 0) {
    await Package.findByIdAndUpdate(this.package, {
      averageRating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count,
    });
  }
});

// ─── Hotel Model ────────────────────────────────────────────
const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['lodge', 'camp', 'hotel', 'resort', 'villa', 'guesthouse'], required: true },
  stars: { type: Number, min: 1, max: 5, required: true },
  location: {
    country: { type: String, required: true },
    region: String,
    city: String,
    address: String,
    coordinates: { lat: Number, lng: Number },
  },
  amenities: [String],
  roomTypes: [{
    name: String,
    description: String,
    pricePerNight: Number,
    maxOccupancy: Number,
    images: [String],
    amenities: [String],
  }],
  coverImage: { public_id: String, url: String },
  gallery: [{ url: String, public_id: String, caption: String }],
  priceRange: { min: Number, max: Number, currency: { type: String, default: 'USD' } },
  checkInTime: { type: String, default: '14:00' },
  checkOutTime: { type: String, default: '11:00' },
  policies: { cancellation: String, children: String, pets: String },
  nearbyAttractions: [String],
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  contact: { phone: String, email: String, website: String },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
}, { timestamps: true });

hotelSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  next();
});

// ─── Flight Booking Model ────────────────────────────────────
const flightSchema = new mongoose.Schema({
  reference: { type: String, unique: true },
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  booking: { type: mongoose.Schema.ObjectId, ref: 'Booking' },
  type: { type: String, enum: ['one_way', 'return', 'multi_city'], required: true },
  cabinClass: { type: String, enum: ['economy', 'premium_economy', 'business', 'first'], default: 'economy' },
  passengers: {
    adults: { type: Number, required: true, min: 1 },
    children: { type: Number, default: 0 },
    infants: { type: Number, default: 0 },
  },
  outbound: {
    from: { type: String, required: true },
    to: { type: String, required: true },
    departureDate: { type: Date, required: true },
    airline: String,
    flightNumber: String,
    departureTime: String,
    arrivalTime: String,
    duration: String,
    stops: { type: Number, default: 0 },
  },
  inbound: {
    from: String,
    to: String,
    departureDate: Date,
    airline: String,
    flightNumber: String,
    departureTime: String,
    arrivalTime: String,
    duration: String,
    stops: Number,
  },
  pricing: {
    total: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    breakdown: {
      baseFare: Number,
      taxes: Number,
      fees: Number,
    },
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'ticketed', 'cancelled', 'completed'],
    default: 'pending',
  },
  ticketNumbers: [String],
  specialRequests: String,
  baggageAllowance: String,
  mealPreference: String,
  seatPreference: String,
  adminNotes: String,
}, { timestamps: true });

flightSchema.pre('save', function (next) {
  if (!this.reference) {
    this.reference = `FLT-${Date.now().toString(36).toUpperCase()}`;
  }
  next();
});

// ─── Visa Application Model ──────────────────────────────────
const visaSchema = new mongoose.Schema({
  reference: { type: String, unique: true },
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  // Applicant info
  applicant: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    dateOfBirth: Date,
    nationality: { type: String, required: true },
    passportNumber: String,
    passportExpiry: Date,
    passportIssuedBy: String,
  },
  // Travel info
  destinationCountry: { type: String, required: true },
  visaType: {
    type: String,
    enum: ['tourist', 'business', 'student', 'transit', 'medical', 'work'],
    required: true,
  },
  travelDate: { type: Date, required: true },
  returnDate: Date,
  duration: Number, // days
  entryType: { type: String, enum: ['single', 'double', 'multiple'], default: 'single' },
  travelPurpose: String,
  accommodation: String,
  fundProof: String,
  // Documents
  documents: [{
    type: String,
    public_id: String,
    url: String,
    name: String,
    uploadedAt: Date,
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    rejectionReason: String,
  }],
  // Processing
  status: {
    type: String,
    enum: ['submitted', 'under_review', 'additional_docs_required', 'approved', 'rejected', 'cancelled'],
    default: 'submitted',
  },
  priority: { type: String, enum: ['normal', 'express', 'urgent'], default: 'normal' },
  pricing: {
    serviceFee: { type: Number, default: 0 },
    visaFee: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    paid: { type: Boolean, default: false },
  },
  consultantNotes: String,
  rejectionReason: String,
  approvedDate: Date,
  visaNumber: String,
  expiryDate: Date,
  assignedTo: { type: mongoose.Schema.ObjectId, ref: 'User' },
  timeline: [{
    status: String,
    note: String,
    date: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  }],
}, { timestamps: true });

visaSchema.pre('save', function (next) {
  if (!this.reference) {
    this.reference = `VISA-${Date.now().toString(36).toUpperCase()}`;
  }
  next();
});

// ─── Notification Model ──────────────────────────────────────
const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['booking_confirmed', 'booking_cancelled', 'payment_received', 'visa_update', 'reminder', 'promotion', 'system', 'review_request'],
    required: true,
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed }, // related IDs
  isRead: { type: Boolean, default: false },
  readAt: Date,
  link: String,
  icon: String,
}, { timestamps: true });

notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ user: 1, createdAt: -1 });

// ─── Contact / Enquiry Model ─────────────────────────────────
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  subject: String,
  message: { type: String, required: true },
  type: { type: String, enum: ['general', 'booking', 'visa', 'complaint', 'partnership'], default: 'general' },
  status: { type: String, enum: ['new', 'read', 'replied', 'resolved', 'spam'], default: 'new' },
  assignedTo: { type: mongoose.Schema.ObjectId, ref: 'User' },
  reply: String,
  repliedAt: Date,
  ipAddress: String,
}, { timestamps: true });

module.exports = {
  Review: mongoose.model('Review', reviewSchema),
  Hotel: mongoose.model('Hotel', hotelSchema),
  Flight: mongoose.model('Flight', flightSchema),
  Visa: mongoose.model('Visa', visaSchema),
  Notification: mongoose.model('Notification', notificationSchema),
  Contact: mongoose.model('Contact', contactSchema),
};
