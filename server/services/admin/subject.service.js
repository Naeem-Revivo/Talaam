const Subject = require('../../models/subject');

/**
 * Create subject
 */
const createSubject = async (subjectData) => {
  return await Subject.create(subjectData);
};

/**
 * Get all subjects
 */
const getAllSubjects = async () => {
  return await Subject.find({}).sort({ createdAt: -1 });
};

/**
 * Find subject by ID
 */
const findSubjectById = async (subjectId) => {
  return await Subject.findById(subjectId);
};

/**
 * Update subject
 */
const updateSubject = async (subject, updateData) => {
  if (updateData.name !== undefined) {
    subject.name = updateData.name;
  }
  return await subject.save();
};

/**
 * Delete subject
 */
const deleteSubject = async (subjectId) => {
  return await Subject.findByIdAndDelete(subjectId);
};

module.exports = {
  createSubject,
  getAllSubjects,
  findSubjectById,
  updateSubject,
  deleteSubject,
};

