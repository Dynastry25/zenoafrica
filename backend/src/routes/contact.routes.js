const express = require('express');
const r = express.Router();
const { Contact } = require('../models/index.models');
const { protect, authorize } = require('../middleware/auth.middleware');
r.post('/', async (req, res, next) => {
  try {
    await Contact.create({ ...req.body, ipAddress: req.ip });
    res.status(201).json({ success: true, message: "Message received! We'll respond within 2 hours." });
  } catch (err) { next(err); }
});
r.get('/', protect, authorize('admin','super_admin'), async (req, res, next) => {
  try { const contacts = await Contact.find().sort('-createdAt').limit(100).lean(); res.status(200).json({ success: true, contacts }); } catch (err) { next(err); }
});
r.patch('/:id', protect, authorize('admin','super_admin'), async (req, res, next) => {
  try { const c = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.status(200).json({ success: true, contact: c }); } catch (err) { next(err); }
});
module.exports = r;
