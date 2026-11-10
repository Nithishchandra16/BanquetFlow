const CateringPackage = require('../models/CateringPackage');

// @desc    Get all catering packages
// @route   GET /api/catering
// @access  Public
const getPackages = async (req, res, next) => {
  try {
    const { status, type } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    } else {
      query.status = 'active';
    }

    if (type && type !== 'all') {
      query.packageType = type;
    }

    const packages = await CateringPackage.find(query).sort({ pricePerPerson: 1 });

    res.json({
      success: true,
      count: packages.length,
      data: packages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single catering package by ID
// @route   GET /api/catering/:id
// @access  Public
const getPackageById = async (req, res, next) => {
  try {
    const pkg = await CateringPackage.findById(req.params.id);

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: 'Catering package not found'
      });
    }

    res.json({
      success: true,
      data: pkg
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create catering package
// @route   POST /api/catering
// @access  Private/Admin
const createPackage = async (req, res, next) => {
  try {
    const {
      name,
      packageType,
      description,
      pricePerPerson,
      isVegOnly,
      menuItems,
      features,
      image,
      status,
      popular
    } = req.body;

    const pkg = await CateringPackage.create({
      name,
      packageType,
      description,
      pricePerPerson: Number(pricePerPerson),
      isVegOnly: isVegOnly || false,
      menuItems: menuItems || {},
      features: features || [],
      image,
      status: status || 'active',
      popular: popular || false
    });

    res.status(201).json({
      success: true,
      message: 'Catering package created successfully',
      data: pkg
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update catering package
// @route   PUT /api/catering/:id
// @access  Private/Admin
const updatePackage = async (req, res, next) => {
  try {
    let pkg = await CateringPackage.findById(req.params.id);

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: 'Catering package not found'
      });
    }

    pkg = await CateringPackage.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Catering package updated successfully',
      data: pkg
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete catering package
// @route   DELETE /api/catering/:id
// @access  Private/Admin
const deletePackage = async (req, res, next) => {
  try {
    const pkg = await CateringPackage.findById(req.params.id);

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: 'Catering package not found'
      });
    }

    await pkg.deleteOne();

    res.json({
      success: true,
      message: 'Catering package deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage
};

