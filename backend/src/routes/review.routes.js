// review.routes.js
const express = require('express');
const r = express.Router();
const { Review } = require('../models/index.models');
const { protect, authorize } = require('../middleware/auth.middleware');
r.post('/', protect, async (req, res, next) => {
  try {
    const existing = await Review.findOne({ user: req.user.id, package: req.body.package });
    if (existing) return res.status(400).json({ success: false, message: 'Already reviewed' });
    const review = await Review.create({ ...req.body, user: req.user.id });
    res.status(201).json({ success: true, review });
  } catch (err) { next(err); }
});
r.get('/package/:packageId', async (req, res, next) => {
  try {
    const reviews = await Review.find({ package: req.params.packageId, isApproved: true })
      .populate('user', 'name avatar').sort('-createdAt').lean();
    res.status(200).json({ success: true, reviews });
  } catch (err) { next(err); }
});
module.exports = r;
