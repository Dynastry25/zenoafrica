// ═══════════════════════════════════════════
// routes/booking.routes.js
// ═══════════════════════════════════════════
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);
router.post('/', bookingController.createBooking);
router.get('/my', bookingController.getMyBookings);
router.get('/:id', bookingController.getBooking);
router.patch('/:id/cancel', bookingController.cancelBooking);
router.get('/', authorize('admin', 'super_admin'), bookingController.getAllBookings);
router.patch('/:id/status', authorize('admin', 'super_admin'), bookingController.updateBookingStatus);

module.exports = router;
