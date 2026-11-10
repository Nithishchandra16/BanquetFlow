const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    customerName: {
      type: String,
      required: true
    },
    customerEmail: {
      type: String,
      required: true
    },
    customerPhone: {
      type: String,
      required: true
    },
    hall: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BanquetHall',
      required: true
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CateringPackage',
      default: null
    },
    eventType: {
      type: String,
      required: true,
      enum: [
        'Wedding',
        'Birthday',
        'Engagement',
        'Reception',
        'Corporate Event',
        'Anniversary',
        'Other'
      ]
    },
    eventDate: {
      type: String, // Stored as YYYY-MM-DD format for precise date matching
      required: true,
      index: true
    },
    timeSlot: {
      type: String,
      required: true,
      enum: [
        'Morning (9:00 AM - 3:00 PM)',
        'Evening (5:00 PM - 11:30 PM)',
        'Full Day (9:00 AM - 11:00 PM)'
      ],
      default: 'Evening (5:00 PM - 11:30 PM)'
    },
    startTime: {
      type: String,
      default: '17:00'
    },
    endTime: {
      type: String,
      default: '23:30'
    },
    guestCount: {
      type: Number,
      required: [true, 'Guest count is required'],
      min: [10, 'Minimum guest count is 10']
    },
    hallPrice: {
      type: Number,
      required: true,
      default: 0
    },
    cateringPricePerPerson: {
      type: Number,
      default: 0
    },
    cateringTotal: {
      type: Number,
      default: 0
    },
    additionalServices: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true }
      }
    ],
    additionalServicesTotal: {
      type: Number,
      default: 0
    },
    subtotal: {
      type: Number,
      required: true
    },
    taxAmount: {
      type: Number,
      default: 0
    },
    totalPrice: {
      type: Number,
      required: true
    },
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'rejected', 'completed'],
      default: 'confirmed' // default confirmed after payment simulation or pending
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'paid'
    },
    specialRequests: {
      type: String,
      default: ''
    },
    cancellationReason: {
      type: String,
      default: ''
    },
    cancellationDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Compound index to help efficiently detect double bookings
bookingSchema.index({ hall: 1, eventDate: 1, timeSlot: 1, bookingStatus: 1 });

module.exports = mongoose.model('Booking', bookingSchema);

