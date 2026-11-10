const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getCustomers,
  getReports
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);
router.use(adminOnly);

router.get('/dashboard-stats', getDashboardStats);
router.get('/customers', getCustomers);
router.get('/reports', getReports);

module.exports = router;

