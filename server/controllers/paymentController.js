const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// @desc    Get payment receipt
// @route   GET /api/payments/receipt/:transactionId
// @access  Private
const getPaymentReceipt = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({ transactionId: req.params.transactionId })
      .populate('booking')
      .populate('customer', 'name email phone');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment receipt not found'
      });
    }

    // Check authorization
    if (
      req.user.role !== 'admin' &&
      payment.customer._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this receipt'
      });
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all payments (Admin)
// @route   GET /api/payments
// @access  Private/Admin
const getAllPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate('customer', 'name email phone')
      .populate('booking', 'bookingId eventType eventDate totalPrice')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPaymentReceipt,
  getAllPayments
};

