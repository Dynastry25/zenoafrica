const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect, authorize('admin', 'super_admin'));
router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.getAllUsers);
router.patch('/users/:id', adminController.updateUser);
router.get('/reports/revenue', adminController.getRevenueReport);
router.get('/reviews/pending', adminController.getPendingReviews);
router.patch('/reviews/:id/approve', adminController.approveReview);
router.post('/notifications/broadcast', adminController.broadcastNotification);

module.exports = router;
