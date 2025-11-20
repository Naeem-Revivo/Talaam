const Exam = require('../../models/exam');

/**
 * Create exam
 */
const createExam = async (examData) => {
  return await Exam.create(examData);
};

/**
 * Get all exams with optional filter
 */
const getAllExams = async (filter = {}) => {
  return await Exam.find(filter).sort({ createdAt: -1 });
};

/**
 * Find exam by ID
 */
const findExamById = async (examId) => {
  return await Exam.findById(examId);
};

/**
 * Update exam
 */
const updateExam = async (exam, updateData) => {
  if (updateData.name !== undefined) {
    exam.name = updateData.name;
  }
  if (updateData.status !== undefined) {
    exam.status = updateData.status;
  }
  return await exam.save();
};

/**
 * Delete exam
 */
const deleteExam = async (examId) => {
  return await Exam.findByIdAndDelete(examId);
};

module.exports = {
  createExam,
  getAllExams,
  findExamById,
  updateExam,
  deleteExam,
};

