const express = require('express');
const r = express.Router();
const { Notification } = require('../models/index.models');
const { protect } = require('../middleware/auth.middleware');
r.use(protect);
r.get('/', async (req, res, next) => {
  try {
    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ user: req.user.id }).sort('-createdAt').limit(50).lean(),
      Notification.countDocuments({ user: req.user.id, isRead: false })
    ]);
    res.status(200).json({ success: true, notifications, unreadCount });
  } catch (err) { next(err); }
});
r.patch('/read-all', async (req, res, next) => {
  try { await Notification.updateMany({ user: req.user.id, isRead: false }, { isRead: true, readAt: new Date() }); res.status(200).json({ success: true }); } catch (err) { next(err); }
});
r.patch('/:id/read', async (req, res, next) => {
  try { await Notification.findByIdAndUpdate(req.params.id, { isRead: true, readAt: new Date() }); res.status(200).json({ success: true }); } catch (err) { next(err); }
});
module.exports = r;
