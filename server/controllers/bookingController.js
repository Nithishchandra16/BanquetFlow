const Booking = require('../models/Booking');
const BanquetHall = require('../models/BanquetHall');
const CateringPackage = require('../models/CateringPackage');
const Payment = require('../models/Payment');

// Helper to generate unique human-readable Booking ID
const generateBookingId = () => {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `BF-${year}-${randomSuffix}`;
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Customer & Admin)
const createBooking = async (req, res, next) => {
  try {
    const {
      hallId,
      packageId,
      eventType,
      eventDate,
      timeSlot,
      guestCount,
      additionalServices = [],
      specialRequests = '',
      customerName,
      customerEmail,
      customerPhone,
      paymentMethod = 'Simulated Academic Gateway',
      cardLast4,
      upiId
    } = req.body;

    // 1. Basic validation
    if (!hallId || !eventType || !eventDate || !timeSlot || !guestCount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required booking details (hall, event type, date, slot, guests)'
      });
    }

    // 2. Validate Banquet Hall
    const hall = await BanquetHall.findById(hallId);
    if (!hall || hall.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'The selected banquet hall is unavailable or not found'
      });
    }

    // 3. Validate Guest Capacity
    const guests = Number(guestCount);
    if (guests < hall.minCapacity) {
      return res.status(400).json({
        success: false,
        message: `Guest count (${guests}) is below minimum hall capacity (${hall.minCapacity})`
      });
    }
    if (guests > hall.maxCapacity) {
      return res.status(400).json({
        success: false,
        message: `Guest count (${guests}) exceeds maximum hall capacity (${hall.maxCapacity})`
      });
    }

    // 4. Validate Date (Cannot book in the past)
    const bookingDate = new Date(eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(bookingDate.getTime()) || bookingDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Event date must be a valid upcoming date'
      });
    }

    // 5. Prevent Double Bookings (Check existing bookings for the same hall & date)
    const existingBookings = await Booking.find({
      hall: hallId,
      eventDate,
      bookingStatus: { $in: ['confirmed', 'pending'] }
    });

    const isFullDayRequested = timeSlot.includes('Full Day');
    const hasFullDayBooked = existingBookings.some((b) =>
      b.timeSlot.includes('Full Day')
    );
    const hasSameSlotBooked = existingBookings.some(
      (b) => b.timeSlot === timeSlot
    );

    if (hasFullDayBooked || (isFullDayRequested && existingBookings.length > 0) || hasSameSlotBooked) {
      return res.status(400).json({
        success: false,
        message: `The selected time slot (${timeSlot}) is already reserved for this hall on ${eventDate}. Please choose another date or slot.`
      });
    }

    // 6. Pricing Calculation
    const hallPrice = Number(hall.hallPrice) || 0;

    let cateringPackage = null;
    let cateringPricePerPerson = 0;
    let cateringTotal = 0;

    if (packageId) {
      cateringPackage = await CateringPackage.findById(packageId);
      if (cateringPackage) {
        cateringPricePerPerson = Number(cateringPackage.pricePerPerson) || 0;
        cateringTotal = guests * cateringPricePerPerson;
      }
    }

    // Additional Services calculation
    let additionalServicesTotal = 0;
    const sanitizedAdditionalServices = [];

    if (Array.isArray(additionalServices)) {
      for (const service of additionalServices) {
        if (service && service.name && !isNaN(service.price)) {
          const price = Number(service.price);
          additionalServicesTotal += price;
          sanitizedAdditionalServices.push({
            name: service.name,
            price
          });
        }
      }
    }

    const subtotal = hallPrice + cateringTotal + additionalServicesTotal;
    const taxRate = 0.05; // 5% GST
    const taxAmount = Math.round(subtotal * taxRate);
    const totalPrice = subtotal + taxAmount;

    // 7. Time range assignment
    let startTime = '17:00';
    let endTime = '23:30';
    if (timeSlot.includes('Morning')) {
      startTime = '09:00';
      endTime = '15:00';
    } else if (timeSlot.includes('Full Day')) {
      startTime = '09:00';
      endTime = '23:00';
    }

    const bookingId = generateBookingId();

    // 8. Create Booking in MongoDB
    const booking = await Booking.create({
      bookingId,
      customer: req.user._id,
      customerName: customerName || req.user.name,
      customerEmail: customerEmail || req.user.email,
      customerPhone: customerPhone || req.user.phone,
      hall: hall._id,
      package: cateringPackage ? cateringPackage._id : null,
      eventType,
      eventDate,
      timeSlot,
      startTime,
      endTime,
      guestCount: guests,
      hallPrice,
      cateringPricePerPerson,
      cateringTotal,
      additionalServices: sanitizedAdditionalServices,
      additionalServicesTotal,
      subtotal,
      taxAmount,
      totalPrice,
      bookingStatus: 'confirmed', // Auto-confirmed on simulated checkout
      paymentStatus: 'paid',
      specialRequests
    });

    // 9. Create Payment Record (Simulated Gateway)
    const paymentId = `PAY-${Date.now().toString().slice(-8)}`;
    const transactionId = `TXN-SESD-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const payment = await Payment.create({
      paymentId,
      booking: booking._id,
      bookingIdString: booking.bookingId,
      customer: req.user._id,
      amount: totalPrice,
      paymentMethod,
      paymentStatus: 'success',
      transactionId,
      paymentDetails: {
        cardLast4: cardLast4 ? cardLast4.slice(-4) : '4242',
        upiId: upiId || ''
      }
    });

    // Populate references for return
    const populatedBooking = await Booking.findById(booking._id)
      .populate('hall')
      .populate('package');

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      data: {
        booking: populatedBooking,
        payment
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private (Customer)
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate('hall', 'name location city address images hallPrice')
      .populate('package', 'name packageType pricePerPerson')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking details
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('hall')
      .populate('package')
      .populate('customer', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Only allow customer who booked or admin
    if (
      req.user.role !== 'admin' &&
      booking.customer._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    // Find linked payment
    const payment = await Payment.findOne({ booking: booking._id });

    res.json({
      success: true,
      data: {
        booking,
        payment
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking (Customer)
// @route   PUT /api/bookings/:id/cancel
// @access  Private (Customer)
const cancelBooking = async (req, res, next) => {
  try {
    const { cancellationReason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking record not found'
      });
    }

    if (
      req.user.role !== 'admin' &&
      booking.customer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking is already cancelled'
      });
    }

    if (booking.bookingStatus === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Past completed events cannot be cancelled'
      });
    }

    booking.bookingStatus = 'cancelled';
    booking.cancellationReason = cancellationReason || 'Cancelled by customer';
    booking.cancellationDate = new Date();
    booking.paymentStatus = 'refunded';

    await booking.save();

    // Update payment record to refunded
    await Payment.updateMany(
      { booking: booking._id },
      { paymentStatus: 'refunded' }
    );

    res.json({
      success: true,
      message: 'Booking cancelled successfully. Simulated refund processed.',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res, next) => {
  try {
    const { status, eventType, date, search } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.bookingStatus = status;
    }

    if (eventType && eventType !== 'all') {
      query.eventType = eventType;
    }

    if (date) {
      query.eventDate = date;
    }

    if (search) {
      query.$or = [
        { bookingId: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
        { customerPhone: { $regex: search, $options: 'i' } }
      ];
    }

    const bookings = await Booking.find(query)
      .populate('hall', 'name location city hallPrice images')
      .populate('package', 'name packageType pricePerPerson')
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (Admin: confirm, reject, cancel, complete)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, paymentStatus, note } = req.body;

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'rejected', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.bookingStatus = status;
    if (paymentStatus) {
      booking.paymentStatus = paymentStatus;
    }
    if (note) {
      booking.specialRequests = booking.specialRequests
        ? `${booking.specialRequests}\n[Admin Note]: ${note}`
        : `[Admin Note]: ${note}`;
    }

    await booking.save();

    res.json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus
};

