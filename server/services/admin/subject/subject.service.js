const Subject = require('../../../models/subject');

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
 * Get paginated subjects with search
 */
const getSubjectsPaginated = async (filters = {}, pagination = {}) => {
  const { search } = filters;
  const { page = 1, limit = 5 } = pagination;

  // Build query
  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  // Calculate skip
  const skip = (page - 1) * limit;

  // Get total count
  const totalItems = await Subject.countDocuments(query);

  // Get paginated results
  const subjects = await Subject.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Calculate pagination info
  const totalPages = Math.ceil(totalItems / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    subjects,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage,
      hasPreviousPage,
    },
    filters: {
      search: search || null,
    },
  };
};

/**
 * Get total count of subjects
 */
const getSubjectsCount = async () => {
  return await Subject.countDocuments();
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
  if (updateData.description !== undefined) {
    subject.description = updateData.description;
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
  getSubjectsPaginated,
  getSubjectsCount,
  findSubjectById,
  updateSubject,
  deleteSubject,
};

