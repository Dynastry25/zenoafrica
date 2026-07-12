const mongoose = require('mongoose');

const itineraryDaySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  activities: [String],
  meals: {
    breakfast: { type: Boolean, default: false },
    lunch: { type: Boolean, default: false },
    dinner: { type: Boolean, default: false },
  },
  accommodation: String,
  image: String,
});

const packageSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Package title is required'], trim: true },
  slug: { type: String, unique: true, lowercase: true },
  subtitle: { type: String, trim: true },
  description: { type: String, required: [true, 'Description is required'] },
  shortDescription: { type: String, maxlength: 300 },

  category: {
    type: String,
    enum: ['safari', 'adventure', 'luxury', 'cultural', 'wildlife', 'beach', 'mountain', 'city'],
    required: true,
  },
  tags: [{ type: String, lowercase: true }],

  // Location
  location: {
    country: { type: String, required: true },
    region: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  destinations: [String], // Multiple stops

  // Duration
  duration: {
    days: { type: Number, required: true },
    nights: { type: Number, required: true },
  },

  // Pricing
  price: {
    adult: { type: Number, required: true },
    child: { type: Number, default: 0 },
    infant: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
  },
  originalPrice: { type: Number },
  discountPercentage: { type: Number, default: 0 },
  depositRequired: { type: Number, default: 30 }, // % deposit

  // Group
  groupSize: {
    min: { type: Number, default: 1 },
    max: { type: Number, default: 20 },
  },
  isPrivateTourAvailable: { type: Boolean, default: true },

  // Media
  coverImage: {
    public_id: String,
    url: { type: String, required: true },
  },
  gallery: [{
    public_id: String,
    url: String,
    caption: String,
  }],
  videoUrl: String,

  // Content
  highlights: [{ type: String }],
  included: [{ type: String }],
  excluded: [{ type: String }],
  itinerary: [itineraryDaySchema],

  // Requirements
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'challenging', 'expert'],
    default: 'easy',
  },
  minAge: { type: Number, default: 0 },
  fitnessLevel: String,
  languages: [{ type: String }],

  // Logistics
  startLocation: String,
  endLocation: String,
  departurePoints: [String],
  availableMonths: [{ type: Number, min: 1, max: 12 }], // best travel months

  // Meta
  badge: String,
  badgeColor: String,
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isBestSeller: { type: Boolean, default: false },

  // Stats
  totalBookings: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },

  // SEO
  metaTitle: String,
  metaDescription: String,

  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// ─── Indexes ────────────────────────────────────────────────
packageSchema.index({ slug: 1 });
packageSchema.index({ category: 1, isFeatured: 1 });
packageSchema.index({ 'price.adult': 1 });
packageSchema.index({ averageRating: -1 });
packageSchema.index({ title: 'text', description: 'text', tags: 'text' });

// ─── Pre-save: Generate Slug ────────────────────────────────
packageSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

// ─── Virtual: Reviews ───────────────────────────────────────
packageSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'package',
});

module.exports = mongoose.model('Package', packageSchema);
