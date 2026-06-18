const User = require('../models/User.model');
const Package = require('../models/Package.model');
const Booking = require('../models/Booking.model');
const { Review, Visa, Hotel, Contact, Notification } = require('../models/index.models');

// ─── @GET /api/admin/dashboard ──────────────────────────────
exports.getDashboard = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalUsers, newUsersThisMonth,
      totalPackages, activePackages,
      totalBookings, bookingsThisMonth,
      totalRevenue, revenueThisMonth,
      pendingBookings, confirmedBookings,
      pendingVisas, newContacts,
      recentBookings, topPackages,
      monthlyRevenue, bookingsByStatus,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'user', createdAt: { $gte: startOfMonth } }),
      Package.countDocuments(),
      Package.countDocuments({ isActive: true }),
      Booking.countDocuments(),
      Booking.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Booking.aggregate([
        { $match: { paymentStatus: { $in: ['deposit_paid', 'fully_paid'] } } },
        { $group: { _id: null, total: { $sum: '$pricing.total' } } },
      ]),
      Booking.aggregate([
        { $match: { createdAt: { $gte: startOfMonth }, paymentStatus: { $in: ['deposit_paid', 'fully_paid'] } } },
        { $group: { _id: null, total: { $sum: '$pricing.total' } } },
      ]),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'confirmed' }),
      Visa.countDocuments({ status: { $in: ['submitted', 'under_review'] } }),
      Contact.countDocuments({ status: 'new' }),
      Booking.find()
        .populate('user', 'name email')
        .populate('package', 'title coverImage category')
        .sort('-createdAt')
        .limit(8)
        .lean(),
      Package.find({ isActive: true })
        .sort('-totalBookings')
        .limit(5)
        .select('title totalBookings averageRating coverImage category')
        .lean(),
      // Last 12 months revenue
      Booking.aggregate([
        { $match: { paymentStatus: { $in: ['deposit_paid', 'fully_paid'] }, createdAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 11, 1) } } },
        { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, revenue: { $sum: '$pricing.total' }, bookings: { $sum: 1 } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
      Booking.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthlyRevenue = monthlyRevenue.map(m => ({
      month: `${months[m._id.month - 1]} ${m._id.year}`,
      revenue: Math.round(m.revenue),
      bookings: m.bookings,
    }));

    res.status(200).json({
      success: true,
      dashboard: {
        stats: {
          users: { total: totalUsers, new: newUsersThisMonth },
          packages: { total: totalPackages, active: activePackages },
          bookings: { total: totalBookings, thisMonth: bookingsThisMonth, pending: pendingBookings, confirmed: confirmedBookings },
          revenue: { total: totalRevenue[0]?.total || 0, thisMonth: revenueThisMonth[0]?.total || 0 },
          pending: { visas: pendingVisas, contacts: newContacts },
        },
        recentBookings,
        topPackages,
        monthlyRevenue: formattedMonthlyRevenue,
        bookingsByStatus: bookingsByStatus.reduce((acc, s) => { acc[s._id] = s.count; return acc; }, {}),
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── @GET /api/admin/users ───────────────────────────────────
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20, sort = '-createdAt' } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(filter).sort(sort).skip(skip).limit(Number(limit)).lean(),
      User.countDocuments(filter),
    ]);
    res.status(200).json({ success: true, count: users.length, total, users });
  } catch (err) {
    next(err);
  }
};

// ─── @PATCH /api/admin/users/:id ────────────────────────────
exports.updateUser = async (req, res, next) => {
  try {
    const { role, isActive } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role, isActive }, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, message: 'User updated', user });
  } catch (err) {
    next(err);
  }
};

// ─── @GET /api/admin/reports/revenue ────────────────────────
exports.getRevenueReport = async (req, res, next) => {
  try {
    const { period = 'monthly', year = new Date().getFullYear() } = req.query;
    let groupBy, dateFilter;
    if (period === 'monthly') {
      groupBy = { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } };
      dateFilter = { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) };
    } else {
      groupBy = { year: { $year: '$createdAt' }, week: { $week: '$createdAt' } };
      dateFilter = { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) };
    }
    const report = await Booking.aggregate([
      { $match: { createdAt: dateFilter, paymentStatus: { $in: ['deposit_paid', 'fully_paid'] } } },
      { $group: { _id: groupBy, revenue: { $sum: '$pricing.total' }, bookings: { $sum: 1 }, avgValue: { $avg: '$pricing.total' } } },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.week': 1 } },
    ]);
    const categoryBreakdown = await Booking.aggregate([
      { $match: { createdAt: dateFilter } },
      { $lookup: { from: 'packages', localField: 'package', foreignField: '_id', as: 'pkg' } },
      { $unwind: '$pkg' },
      { $group: { _id: '$pkg.category', revenue: { $sum: '$pricing.total' }, count: { $sum: 1 } } },
      { $sort: { revenue: -1 } },
    ]);
    res.status(200).json({ success: true, report, categoryBreakdown });
  } catch (err) {
    next(err);
  }
};

// ─── @GET /api/admin/reviews ─────────────────────────────────
exports.getPendingReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ isApproved: false })
      .populate('user', 'name email')
      .populate('package', 'title')
      .sort('-createdAt')
      .lean();
    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (err) {
    next(err);
  }
};

// ─── @PATCH /api/admin/reviews/:id/approve ──────────────────
exports.approveReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.status(200).json({ success: true, message: 'Review approved', review });
  } catch (err) {
    next(err);
  }
};

// ─── @POST /api/admin/notifications/broadcast ───────────────
exports.broadcastNotification = async (req, res, next) => {
  try {
    const { title, message, type = 'promotion', userIds } = req.body;
    const filter = userIds ? { _id: { $in: userIds } } : { role: 'user', isActive: true };
    const users = await User.find(filter).select('_id').lean();
    const notifications = users.map(u => ({ user: u._id, type, title, message }));
    await Notification.insertMany(notifications);
    res.status(200).json({ success: true, message: `Notification sent to ${notifications.length} users` });
  } catch (err) {
    next(err);
  }
};
