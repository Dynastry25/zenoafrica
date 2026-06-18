const express = require('express');
const r = express.Router();
const { Hotel } = require('../models/index.models');
const { protect, authorize } = require('../middleware/auth.middleware');
r.get('/', async (req, res, next) => {
  try {
    const { country, category, page = 1, limit = 12 } = req.query;
    const filter = { isActive: true };
    if (country) filter['location.country'] = { $regex: country, $options: 'i' };
    if (category) filter.category = category;
    const [hotels, total] = await Promise.all([Hotel.find(filter).sort('-isFeatured -averageRating').skip((page-1)*limit).limit(+limit).lean(), Hotel.countDocuments(filter)]);
    res.status(200).json({ success: true, total, hotels });
  } catch (err) { next(err); }
});
r.post('/', protect, authorize('admin', 'super_admin'), async (req, res, next) => {
  try { const hotel = await Hotel.create({ ...req.body, createdBy: req.user.id }); res.status(201).json({ success: true, hotel }); } catch (err) { next(err); }
});
module.exports = r;
