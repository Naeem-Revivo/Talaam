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
  if (updateData.description !== undefined) {
    updateDataFiltered.description = updateData.description;
  }
  if (updateData.status !== undefined) {
    updateDataFiltered.status = updateData.status;
  }
  return await Exam.update(exam.id, updateDataFiltered);
};

/**
 * Delete exam
 * Cascading: Also deletes all subjects related to this exam and all topics related to those subjects
 */
const deleteExam = async (examId) => {
  const { prisma } = require('../../../config/db/prisma');
  
  // Find all subjects related to this exam
  const subjects = await prisma.subject.findMany({
    where: { examId: examId }
  });
  
  // For each subject, delete all related topics
  for (const subject of subjects) {
    await prisma.topic.deleteMany({
      where: { parentSubject: subject.id }
    });
  }
  
  // Delete all subjects related to this exam
  await prisma.subject.deleteMany({
    where: { examId: examId }
  });
  
  // Finally, delete the exam
  return await Exam.delete(examId);
};

module.exports = {
  createExam,
  getAllExams,
  findExamById,
  updateExam,
  deleteExam,
};

