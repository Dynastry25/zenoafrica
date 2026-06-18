const express = require('express');
const r = express.Router();
const { Flight } = require('../models/index.models');
const { protect } = require('../middleware/auth.middleware');
r.post('/', protect, async (req, res, next) => {
  try { const flight = await Flight.create({ ...req.body, user: req.user.id }); res.status(201).json({ success: true, flight }); } catch (err) { next(err); }
});
r.get('/my', protect, async (req, res, next) => {
  try { const flights = await Flight.find({ user: req.user.id }).sort('-createdAt').lean(); res.status(200).json({ success: true, flights }); } catch (err) { next(err); }
});
module.exports = r;
