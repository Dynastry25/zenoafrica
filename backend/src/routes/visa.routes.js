// visa.routes.js
const express = require('express');
const router = express.Router();
const { Visa } = require('../models/index.models');
const { protect, authorize } = require('../middleware/auth.middleware');
const { sendEmail } = require('../utils/email.util');

router.post('/', async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.user) data.user = req.user.id;
    const visa = await Visa.create(data);
    res.status(201).json({ success: true, message: 'Visa application submitted', visa });
  } catch (err) { next(err); }
});
router.get('/my', protect, async (req, res, next) => {
  try {
    const visas = await Visa.find({ user: req.user.id }).sort('-createdAt').lean();
    res.status(200).json({ success: true, visas });
  } catch (err) { next(err); }
});
router.get('/', protect, authorize('admin', 'super_admin'), async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const [visas, total] = await Promise.all([
      Visa.find(filter).sort('-createdAt').skip((page-1)*limit).limit(+limit).lean(),
      Visa.countDocuments(filter)
    ]);
    res.status(200).json({ success: true, total, visas });
  } catch (err) { next(err); }
});
router.patch('/:id/status', protect, authorize('admin', 'super_admin'), async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const visa = await Visa.findByIdAndUpdate(req.params.id,
      { status, consultantNotes: notes, $push: { timeline: { status, note: notes, updatedBy: req.user.id } } },
      { new: true }
    );
    res.status(200).json({ success: true, visa });
  } catch (err) { next(err); }
});
module.exports = router;
