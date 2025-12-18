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
  const { prisma } = require('../../../config/db/prisma');
  return await prisma.subject.findMany({
    include: {
      exam: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' }
  });
};

/**
 * Get paginated subjects with search
 */
const getSubjectsPaginated = async (filters = {}, pagination = {}) => {
  const { search } = filters;
  const { page = 1, limit = 5 } = pagination;
  const { prisma } = require('../../../config/db/prisma');

  // Build where clause for Prisma
  const where = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Calculate skip
  const skip = (page - 1) * limit;

  // Get total count
  const totalItems = await prisma.subject.count({ where });

  // Get paginated results
  const subjects = await Subject.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit,
  });

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
  const { prisma } = require('../../../config/db/prisma');
  return await prisma.subject.count();
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
  const updateDataFiltered = {};
  if (updateData.name !== undefined) {
    updateDataFiltered.name = updateData.name;
  }
  if (updateData.description !== undefined) {
    updateDataFiltered.description = updateData.description;
  }
  return await Subject.update(subject.id, updateDataFiltered);
};

/**
 * Delete subject
 * Cascading: Also deletes all topics related to this subject
 */
const deleteSubject = async (subjectId) => {
  const { prisma } = require('../../../config/db/prisma');
  
  // Delete all topics related to this subject first
  // Note: Prisma schema has onDelete: Cascade, but we'll do it explicitly for clarity
  await prisma.topic.deleteMany({
    where: { parentSubject: subjectId }
  });
  
  // Then delete the subject
  return await Subject.delete(subjectId);
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

