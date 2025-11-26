const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    // Workflow status
    status: {
      type: String,
      enum: [
        'pending_gatherer',    // Initial state (not used, but kept for consistency)
        'pending_processor',   // Waiting for processor approval
        'pending_creator',     // Waiting for creator to review/update
        'pending_explainer',   // Waiting for explainer to add/update explanation
        'completed',           // Final approved state
        'rejected',            // Rejected by processor
      ],
      default: 'pending_processor',
    },
    
    // Classification
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
    
    // Question details
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    questionType: {
      type: String,
      enum: ['MCQ', 'True/False', 'Short Answer', 'Essay'],
      required: [true, 'Question type is required'],
    },
    
    // MCQ specific fields
    options: {
      type: {
        A: { type: String, trim: true },
        B: { type: String, trim: true },
        C: { type: String, trim: true },
        D: { type: String, trim: true },
      },
      required: function() {
        return this.questionType === 'MCQ';
      },
    },
    correctAnswer: {
      type: String,
      enum: ['A', 'B', 'C', 'D'],
      required: function() {
        return this.questionType === 'MCQ';
      },
    },
    
    // Explanation (optional for gatherer, required for explainer)
    explanation: {
      type: String,
      trim: true,
      default: '',
    },
    
    // Variant tracking
    originalQuestion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      default: null,
    },
    isVariant: {
      type: Boolean,
      default: false,
    },
    
    // Workflow tracking
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    
    // History tracking
    history: [
      {
        action: {
          type: String,
          enum: ['created', 'updated', 'approved', 'rejected', 'submitted', 'variant_created'],
        },
        performedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        role: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        notes: String,
      },
    ],
    
    // Comments (optional)
    comments: [
      {
        comment: {
          type: String,
          required: true,
          trim: true,
        },
        commentedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
questionSchema.index({ exam: 1, subject: 1, topic: 1 });
questionSchema.index({ status: 1 });
questionSchema.index({ createdBy: 1 });
questionSchema.index({ originalQuestion: 1 });

module.exports = mongoose.model('Question', questionSchema);

