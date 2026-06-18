const express = require('express');
const router = express.Router();
const packageController = require('../controllers/package.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/', packageController.getPackages);
router.get('/featured', packageController.getFeaturedPackages);
router.get('/search', packageController.searchPackages);
router.get('/categories/stats', packageController.getCategoryStats);
router.get('/:slug', packageController.getPackage);

// Admin only
router.post('/', protect, authorize('admin', 'super_admin'), packageController.createPackage);
router.put('/:id', protect, authorize('admin', 'super_admin'), packageController.updatePackage);
router.delete('/:id', protect, authorize('admin', 'super_admin'), packageController.deletePackage);

module.exports = router;
