const BanquetHall = require('../models/BanquetHall');
const Booking = require('../models/Booking');

// @desc    Get all banquet halls with advanced filters
// @route   GET /api/halls
// @access  Public
const getHalls = async (req, res, next) => {
  try {
    const {
      search,
      city,
      location,
      hallType,
      hasAC,
      minGuests,
      maxPrice,
      facility,
      sort,
      status
    } = req.query;

    let query = {};

    // Filter by active status for public, admin can request all
    if (status) {
      query.status = status;
    } else {
      query.status = 'active';
    }

    // Search keyword in name, location, city, description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (city && city !== 'all') {
      query.city = { $regex: new RegExp(`^${city}$`, 'i') };
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (hallType && hallType !== 'all') {
      query.hallType = hallType;
    }

    if (hasAC !== undefined && hasAC !== 'all' && hasAC !== '') {
      query.hasAC = hasAC === 'true' || hasAC === true;
    }

    if (minGuests) {
      const guests = parseInt(minGuests, 10);
      if (!isNaN(guests)) {
        query.maxCapacity = { $gte: guests };
        query.minCapacity = { $lte: guests };
      }
    }

    if (maxPrice) {
      const price = parseFloat(maxPrice);
      if (!isNaN(price)) {
        query.hallPrice = { $lte: price };
      }
    }

    if (facility && facility !== 'all') {
      query.facilities = { $in: [facility] };
    }

    // Sorting
    let sortOption = { featured: -1, rating: -1 };
    if (sort === 'price-low') {
      sortOption = { hallPrice: 1 };
    } else if (sort === 'price-high') {
      sortOption = { hallPrice: -1 };
    } else if (sort === 'capacity-high') {
      sortOption = { maxCapacity: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    }

    const halls = await BanquetHall.find(query).sort(sortOption);

    res.json({
      success: true,
      count: halls.length,
      data: halls
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single banquet hall by ID
// @route   GET /api/halls/:id
// @access  Public
const getHallById = async (req, res, next) => {
  try {
    const hall = await BanquetHall.findById(req.params.id);

    if (!hall) {
      return res.status(404).json({
        success: false,
        message: 'Banquet hall not found'
      });
    }

    res.json({
      success: true,
      data: hall
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check banquet hall availability for a specific date
// @route   GET /api/halls/:id/availability
// @access  Public
const checkHallAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an event date (YYYY-MM-DD)'
      });
    }

    const hall = await BanquetHall.findById(id);
    if (!hall) {
      return res.status(404).json({
        success: false,
        message: 'Banquet hall not found'
      });
    }

    // Find all bookings for this hall on the requested date that are confirmed or pending
    const existingBookings = await Booking.find({
      hall: id,
      eventDate: date,
      bookingStatus: { $in: ['confirmed', 'pending'] }
    }).select('timeSlot eventType bookingStatus startTime endTime');

    const bookedSlots = existingBookings.map((b) => b.timeSlot);
    const hasFullDay = bookedSlots.includes('Full Day (9:00 AM - 11:00 PM)');

    const slots = [
      {
        id: 'morning',
        name: 'Morning (9:00 AM - 3:00 PM)',
        time: '09:00 - 15:00',
        isAvailable: !hasFullDay && !bookedSlots.includes('Morning (9:00 AM - 3:00 PM)')
      },
      {
        id: 'evening',
        name: 'Evening (5:00 PM - 11:30 PM)',
        time: '17:00 - 23:30',
        isAvailable: !hasFullDay && !bookedSlots.includes('Evening (5:00 PM - 11:30 PM)')
      },
      {
        id: 'fullday',
        name: 'Full Day (9:00 AM - 11:00 PM)',
        time: '09:00 - 23:00',
        isAvailable: bookedSlots.length === 0
      }
    ];

    const isFullyBooked = !slots.some((s) => s.isAvailable);

    res.json({
      success: true,
      hallId: id,
      date,
      isFullyBooked,
      slots,
      existingBookingsCount: existingBookings.length
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a review to a banquet hall
// @route   POST /api/halls/:id/reviews
// @access  Private (Customer)
const addHallReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const hall = await BanquetHall.findById(req.params.id);

    if (!hall) {
      return res.status(404).json({
        success: false,
        message: 'Banquet hall not found'
      });
    }

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both rating (1-5) and comment'
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = hall.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this banquet hall'
      });
    }

    const review = {
      user: req.user._id,
      userName: req.user.name,
      rating: Number(rating),
      comment
    };

    hall.reviews.push(review);
    hall.reviewCount = hall.reviews.length;
    hall.rating = Number(
      (
        hall.reviews.reduce((acc, item) => item.rating + acc, 0) /
        hall.reviews.length
      ).toFixed(1)
    );

    await hall.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: hall
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new banquet hall
// @route   POST /api/halls
// @access  Private/Admin
const createHall = async (req, res, next) => {
  try {
    const {
      name,
      location,
      city,
      address,
      description,
      minCapacity,
      maxCapacity,
      hallPrice,
      hallType,
      hasAC,
      facilities,
      images,
      rules,
      status,
      featured
    } = req.body;

    const hall = await BanquetHall.create({
      name,
      location,
      city,
      address,
      description,
      minCapacity: Number(minCapacity),
      maxCapacity: Number(maxCapacity),
      hallPrice: Number(hallPrice),
      hallType: hallType || 'Indoor',
      hasAC: hasAC !== undefined ? hasAC : true,
      facilities: Array.isArray(facilities) ? facilities : [facilities].filter(Boolean),
      images: Array.isArray(images) && images.length ? images : [
        'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80'
      ],
      rules: Array.isArray(rules) && rules.length ? rules : undefined,
      status: status || 'active',
      featured: featured || false
    });

    res.status(201).json({
      success: true,
      message: 'Banquet hall created successfully',
      data: hall
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update banquet hall
// @route   PUT /api/halls/:id
// @access  Private/Admin
const updateHall = async (req, res, next) => {
  try {
    let hall = await BanquetHall.findById(req.params.id);

    if (!hall) {
      return res.status(404).json({
        success: false,
        message: 'Banquet hall not found'
      });
    }

    hall = await BanquetHall.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Banquet hall updated successfully',
      data: hall
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete banquet hall
// @route   DELETE /api/halls/:id
// @access  Private/Admin
const deleteHall = async (req, res, next) => {
  try {
    const hall = await BanquetHall.findById(req.params.id);

    if (!hall) {
      return res.status(404).json({
        success: false,
        message: 'Banquet hall not found'
      });
    }

    // Check if there are active bookings
    const activeBookings = await Booking.countDocuments({
      hall: req.params.id,
      bookingStatus: { $in: ['confirmed', 'pending'] }
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete banquet hall with ${activeBookings} active booking(s). Please archive or mark it inactive instead.`
      });
    }

    await hall.deleteOne();

    res.json({
      success: true,
      message: 'Banquet hall deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHalls,
  getHallById,
  checkHallAvailability,
  addHallReview,
  createHall,
  updateHall,
  deleteHall
};

