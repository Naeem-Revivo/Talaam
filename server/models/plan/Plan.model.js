const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Plan name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number'],
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      enum: ['Monthly', 'Quarterly', 'Semi-Annual', 'Annual'],
      default: 'Monthly',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['active', 'inactive'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Plan', planSchema);

