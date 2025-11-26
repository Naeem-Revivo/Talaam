const mongoose = require('mongoose');

const classificationSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: [true, 'Exam is required'],
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject is required'],
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: [true, 'Topic is required'],
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
classificationSchema.index({ exam: 1, subject: 1, topic: 1 });
classificationSchema.index({ status: 1 });

// Prevent duplicate classifications
classificationSchema.index({ exam: 1, subject: 1, topic: 1 }, { unique: true });

module.exports = mongoose.model('Classification', classificationSchema);

