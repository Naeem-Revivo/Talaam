const mongoose = require('mongoose');

const studentAnswerSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student is required'],
      index: true,
    },
    mode: {
      type: String,
      enum: ['study', 'test'],
      required: [true, 'Mode is required'],
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: [true, 'Exam is required'],
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
    },
    // For study mode: single question answer
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    },
    selectedAnswer: {
      type: String,
      required: [true, 'Selected answer is required'],
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
    // For test mode: multiple questions
    answers: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question',
          required: true,
        },
        selectedAnswer: {
          type: String,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          default: false,
        },
      },
    ],
    // Test mode results
    totalQuestions: {
      type: Number,
      default: 0,
    },
    correctAnswers: {
      type: Number,
      default: 0,
    },
    incorrectAnswers: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    // Status: in_progress, completed
    status: {
      type: String,
      enum: ['in_progress', 'completed'],
      default: 'completed',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
studentAnswerSchema.index({ student: 1, exam: 1, createdAt: -1 });
studentAnswerSchema.index({ student: 1, mode: 1, createdAt: -1 });

module.exports = mongoose.model('StudentAnswer', studentAnswerSchema);


