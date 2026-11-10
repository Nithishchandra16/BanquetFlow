const mongoose = require('mongoose');

const cateringPackageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Package name is required'],
      trim: true
    },
    packageType: {
      type: String,
      enum: ['Basic', 'Premium', 'Royal'],
      required: true
    },
    description: {
      type: String,
      required: [true, 'Package description is required']
    },
    pricePerPerson: {
      type: Number,
      required: [true, 'Price per person is required'],
      min: 0
    },
    isVegOnly: {
      type: Boolean,
      default: false
    },
    menuItems: {
      welcomeDrinks: {
        type: [String],
        default: []
      },
      starters: {
        type: [String],
        default: []
      },
      mainCourse: {
        type: [String],
        default: []
      },
      desserts: {
        type: [String],
        default: []
      },
      liveCounters: {
        type: [String],
        default: []
      }
    },
    features: {
      type: [String],
      default: []
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80'
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    popular: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('CateringPackage', cateringPackageSchema);

