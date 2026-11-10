const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true
    },
    bookingIdString: {
      type: String,
      required: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'Credit/Debit Card', 'Net Banking', 'Simulated Academic Gateway'],
      default: 'Simulated Academic Gateway'
    },
    paymentStatus: {
      type: String,
      enum: ['success', 'pending', 'failed', 'refunded'],
      default: 'success'
    },
    transactionId: {
      type: String,
      required: true,
      unique: true
    },
    paymentDetails: {
      cardLast4: { type: String, default: '' },
      upiId: { type: String, default: '' },
      bankName: { type: String, default: '' }
    },
    paymentDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Payment', paymentSchema);

