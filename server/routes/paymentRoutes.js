const express = require('express');
const router = express.Router();
const {
  getPaymentReceipt,
  getAllPayments
} = require('../controllers/paymentController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/receipt/:transactionId', protect, getPaymentReceipt);
router.get('/', protect, adminOnly, getAllPayments);

module.exports = router;

