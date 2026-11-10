const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

const banquetHallSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Banquet hall name is required'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Locality/Area is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Full address is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    minCapacity: {
      type: Number,
      required: [true, 'Minimum guest capacity is required'],
      min: 10
    },
    maxCapacity: {
      type: Number,
      required: [true, 'Maximum guest capacity is required'],
      validate: {
        validator: function (val) {
          return val >= this.minCapacity;
        },
        message: 'Maximum capacity must be greater than or equal to minimum capacity'
      }
    },
    hallPrice: {
      type: Number,
      required: [true, 'Hall base rental price is required'],
      min: 0
    },
    hallType: {
      type: String,
      enum: ['Indoor', 'Outdoor', 'Both'],
      default: 'Indoor'
    },
    hasAC: {
      type: Boolean,
      default: true
    },
    facilities: {
      type: [String],
      default: []
    },
    images: {
      type: [String],
      required: [true, 'At least one image is required'],
      validate: {
        validator: function (val) {
          return val && val.length > 0;
        },
        message: 'A banquet hall must have at least one photograph'
      }
    },
    rules: {
      type: [String],
      default: [
        'Loud music permitted until 10:30 PM per local municipality regulations',
        'Alcohol consumption requires a valid temporary banquet event permit',
        'Fireworks and hazardous materials are strictly prohibited on premises',
        'Decoration setup allowed 3 hours prior to the scheduled booking slot'
      ]
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    reviews: [reviewSchema],
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

banquetHallSchema.index({ city: 1, location: 1, hallType: 1, hasAC: 1 });

module.exports = mongoose.model('BanquetHall', banquetHallSchema);

