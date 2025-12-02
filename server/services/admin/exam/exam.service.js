const Exam = require('../../../models/exam');

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
  return await Exam.findMany({
    where: filter,
    orderBy: { createdAt: 'desc' }
  });
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
  const updateDataFiltered = {};
  if (updateData.name !== undefined) {
    updateDataFiltered.name = updateData.name;
  }
  if (updateData.status !== undefined) {
    updateDataFiltered.status = updateData.status;
  }
  return await Exam.update(exam.id, updateDataFiltered);
};

/**
 * Delete exam
 */
const deleteExam = async (examId) => {
  return await Exam.delete(examId);
};

module.exports = {
  createExam,
  getAllExams,
  findExamById,
  updateExam,
  deleteExam,
};

