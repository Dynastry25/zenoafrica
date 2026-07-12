const Package = require('../models/Package.model');
const { Review } = require('../models/index.models');

// ─── @GET /api/packages ─────────────────────────────────────
exports.getPackages = async (req, res, next) => {
  try {
    const {
      category, minPrice, maxPrice, duration, difficulty,
      search, featured, sort = '-createdAt', page = 1, limit = 12,
    } = req.query;

    const filter = { isActive: true };
    if (category && category !== 'all') filter.category = category;
    if (featured === 'true') filter.isFeatured = true;
    if (difficulty) filter.difficulty = difficulty;
    if (minPrice || maxPrice) {
      filter['price.adult'] = {};
      if (minPrice) filter['price.adult'].$gte = Number(minPrice);
      if (maxPrice) filter['price.adult'].$lte = Number(maxPrice);
    }
    if (duration) {
      const [min, max] = duration.split('-').map(Number);
      filter['duration.days'] = { $gte: min || 0, $lte: max || 365 };
    }
    if (search) {
      filter.$text = { $search: search };
    }

    const sortMap = {
      '-createdAt': { createdAt: -1 },
      'price-low': { 'price.adult': 1 },
      'price-high': { 'price.adult': -1 },
      rating: { averageRating: -1 },
      popular: { totalBookings: -1 },
    };

    const skip = (Number(page) - 1) * Number(limit);
    const [packages, total] = await Promise.all([
      Package.find(filter)
        .select('-itinerary -excluded -createdBy')
        .sort(sortMap[sort] || { createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Package.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: packages.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      packages,
    });
  } catch (err) {
    next(err);
  }
};

// ─── @GET /api/packages/:slug ────────────────────────────────
exports.getPackage = async (req, res, next) => {
  try {
    const pkg = await Package.findOne({ slug: req.params.slug, isActive: true })
      .populate('createdBy', 'name')
      .lean();
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    const reviews = await Review.find({ package: pkg._id, isApproved: true })
      .populate('user', 'name avatar')
      .sort('-createdAt')
      .limit(10)
      .lean();
    res.status(200).json({ success: true, package: { ...pkg, reviews } });
  } catch (err) {
    next(err);
  }
};

// ─── @GET /api/packages/featured ────────────────────────────
exports.getFeaturedPackages = async (req, res, next) => {
  try {
    const packages = await Package.find({ isFeatured: true, isActive: true })
      .select('-itinerary -excluded')
      .sort('-averageRating')
      .limit(6)
      .lean();
    res.status(200).json({ success: true, count: packages.length, packages });
  } catch (err) {
    next(err);
  }
};

// ─── @POST /api/packages ─────────────────────────────────────
exports.createPackage = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;
    const pkg = await Package.create(req.body);
    res.status(201).json({ success: true, message: 'Package created successfully', package: pkg });
  } catch (err) {
    next(err);
  }
};

// ─── @PUT /api/packages/:id ──────────────────────────────────
exports.updatePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    res.status(200).json({ success: true, message: 'Package updated', package: pkg });
  } catch (err) {
    next(err);
  }
};

// ─── @DELETE /api/packages/:id ───────────────────────────────
exports.deletePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    pkg.isActive = false;
    await pkg.save();
    res.status(200).json({ success: true, message: 'Package deactivated' });
  } catch (err) {
    next(err);
  }
};

// ─── @GET /api/packages/search ──────────────────────────────
exports.searchPackages = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, message: 'Search query required' });
    const packages = await Package.find(
      { $text: { $search: q }, isActive: true },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(10)
      .select('title slug coverImage price duration location category averageRating')
      .lean();
    res.status(200).json({ success: true, count: packages.length, packages });
  } catch (err) {
    next(err);
  }
};

// ─── @GET /api/packages/categories/stats ────────────────────
exports.getCategoryStats = async (req, res, next) => {
  try {
    const stats = await Package.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 }, avgPrice: { $avg: '$price.adult' }, avgRating: { $avg: '$averageRating' } } },
      { $sort: { count: -1 } },
    ]);
    res.status(200).json({ success: true, stats });
  } catch (err) {
    next(err);
  }
};
