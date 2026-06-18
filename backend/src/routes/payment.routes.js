const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Stripe webhook (no auth, raw body)
router.post('/webhook', paymentController.stripeWebhook);

// Protected routes
router.use(protect);
router.post('/create-intent', paymentController.createPaymentIntent);
router.post('/confirm', paymentController.confirmPayment);
router.get('/history', paymentController.getPaymentHistory);
router.post('/refund', authorize('admin', 'super_admin'), paymentController.processRefund);

module.exports = router;
