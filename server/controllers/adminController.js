const User = require('../models/User');
const BanquetHall = require('../models/BanquetHall');
const CateringPackage = require('../models/CateringPackage');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

// @desc    Get dashboard metrics & summary
// @route   GET /api/admin/dashboard-stats
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const totalHalls = await BanquetHall.countDocuments();
    const activeHalls = await BanquetHall.countDocuments({ status: 'active' });
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalPackages = await CateringPackage.countDocuments();

    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ bookingStatus: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ bookingStatus: 'confirmed' });
    const cancelledBookings = await Booking.countDocuments({ bookingStatus: 'cancelled' });
    const completedBookings = await Booking.countDocuments({ bookingStatus: 'completed' });

    // Calculate revenue from non-cancelled bookings
    const revenueAggregation = await Booking.aggregate([
      { $match: { bookingStatus: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
    ]);

    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

    // Recent 5 bookings
    const recentBookings = await Booking.find()
      .populate('hall', 'name location city')
      .populate('package', 'name')
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent 5 customers
    const recentCustomers = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        stats: {
          totalHalls,
          activeHalls,
          totalCustomers,
          totalPackages,
          totalBookings,
          pendingBookings,
          confirmedBookings,
          cancelledBookings,
          completedBookings,
          totalRevenue
        },
        recentBookings,
        recentCustomers
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered customers with booking count & spend
// @route   GET /api/admin/customers
// @access  Private/Admin
const getCustomers = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = { role: 'customer' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const customers = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    // Aggregate booking stats for each customer
    const customerStats = await Booking.aggregate([
      {
        $group: {
          _id: '$customer',
          bookingCount: { $sum: 1 },
          totalSpent: {
            $sum: {
              $cond: [
                { $in: ['$bookingStatus', ['confirmed', 'completed']] },
                '$totalPrice',
                0
              ]
            }
          }
        }
      }
    ]);

    const statsMap = {};
    customerStats.forEach((s) => {
      statsMap[s._id.toString()] = {
        bookingCount: s.bookingCount,
        totalSpent: s.totalSpent
      };
    });

    const customersWithMetrics = customers.map((c) => {
      const stats = statsMap[c._id.toString()] || { bookingCount: 0, totalSpent: 0 };
      return {
        _id: c._id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        address: c.address,
        createdAt: c.createdAt,
        bookingCount: stats.bookingCount,
        totalSpent: stats.totalSpent
      };
    });

    res.json({
      success: true,
      count: customersWithMetrics.length,
      data: customersWithMetrics
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed analytical reports
// @route   GET /api/admin/reports
// @access  Private/Admin
const getReports = async (req, res, next) => {
  try {
    // 1. Monthly booking & revenue trends (last 6-12 months)
    const monthlyStats = await Booking.aggregate([
      {
        $group: {
          _id: {
            $substr: ['$eventDate', 0, 7] // Group by YYYY-MM
          },
          bookingsCount: { $sum: 1 },
          confirmedCount: {
            $sum: { $cond: [{ $eq: ['$bookingStatus', 'confirmed'] }, 1, 0] }
          },
          revenue: {
            $sum: {
              $cond: [
                { $in: ['$bookingStatus', ['confirmed', 'completed']] },
                '$totalPrice',
                0
              ]
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 2. Most popular banquet halls
    const popularHalls = await Booking.aggregate([
      { $match: { bookingStatus: { $in: ['confirmed', 'completed', 'pending'] } } },
      {
        $group: {
          _id: '$hall',
          totalBookings: { $sum: 1 },
          revenueGenerated: { $sum: '$totalPrice' }
        }
      },
      { $sort: { totalBookings: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'banquethalls',
          localField: '_id',
          foreignField: '_id',
          as: 'hallInfo'
        }
      },
      { $unwind: '$hallInfo' },
      {
        $project: {
          _id: 1,
          totalBookings: 1,
          revenueGenerated: 1,
          hallName: '$hallInfo.name',
          city: '$hallInfo.city',
          hallPrice: '$hallInfo.hallPrice',
          image: { $arrayElemAt: ['$hallInfo.images', 0] }
        }
      }
    ]);

    // 3. Most popular catering packages
    const popularPackages = await Booking.aggregate([
      {
        $match: {
          package: { $ne: null },
          bookingStatus: { $in: ['confirmed', 'completed', 'pending'] }
        }
      },
      {
        $group: {
          _id: '$package',
          totalBookings: { $sum: 1 },
          cateringRevenue: { $sum: '$cateringTotal' }
        }
      },
      { $sort: { totalBookings: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'cateringpackages',
          localField: '_id',
          foreignField: '_id',
          as: 'packageInfo'
        }
      },
      { $unwind: '$packageInfo' },
      {
        $project: {
          _id: 1,
          totalBookings: 1,
          cateringRevenue: 1,
          packageName: '$packageInfo.name',
          packageType: '$packageInfo.packageType',
          pricePerPerson: '$packageInfo.pricePerPerson'
        }
      }
    ]);

    // 4. Event Types Breakdown
    const eventTypeDistribution = await Booking.aggregate([
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 },
          totalRevenue: {
            $sum: {
              $cond: [
                { $in: ['$bookingStatus', ['confirmed', 'completed']] },
                '$totalPrice',
                0
              ]
            }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        monthlyStats,
        popularHalls,
        popularPackages,
        eventTypeDistribution
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getCustomers,
  getReports
};

