const Topic = require('../../../models/topic');
const Subject = require('../../../models/subject');

/**
 * Create topic
 */
const createTopic = async (topicData) => {
  const topic = await Topic.create(topicData);
  // Fetch with relation included
  return await Topic.findById(topic.id);
};

/**
 * Get all topics with optional filter by parent subject
 */
const getAllTopics = async (filter = {}) => {
  const where = {};
  if (filter.parentSubject) {
    where.parentSubject = filter.parentSubject;
  }
  return await Topic.findMany({
    where,
    include: { subject: true },
    orderBy: { createdAt: 'desc' }
  });
};

/**
 * Find topic by ID
 */
const findTopicById = async (topicId) => {
  return await Topic.findById(topicId);
};

/**
 * Find topics by parent subject ID with optional search
 */
const findTopicsByParentSubject = async (parentSubjectId, search = null) => {
  const where = { parentSubject: parentSubjectId };
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }
  
  return await Topic.findMany({
    where,
    include: { subject: true },
    orderBy: { createdAt: 'desc' }
  });
};

/**
 * Get paginated topics with search
 */
const getTopicsPaginated = async (filters = {}, pagination = {}) => {
  const { search } = filters;
  const { page = 1, limit = 5 } = pagination;

  // Build where clause
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
  const { prisma } = require('../../../config/db/prisma');
  const totalItems = await prisma.topic.count({ where });

  // Get paginated results
  const topics = await Topic.findMany({
    where,
    include: { subject: true },
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit,
  });

  // Calculate pagination info
  const totalPages = Math.ceil(totalItems / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    topics,
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
 * Get total count of topics
 */
const getTopicsCount = async () => {
  const { prisma } = require('../../../config/db/prisma');
  return await prisma.topic.count();
};

/**
 * Find subject by ID
 */
const findSubjectById = async (subjectId) => {
  return await Subject.findById(subjectId);
};

/**
 * Update topic
 */
const updateTopic = async (topic, updateData) => {
  const updateDataFiltered = {};
  if (updateData.parentSubject !== undefined) {
    updateDataFiltered.parentSubject = updateData.parentSubject;
  }
  if (updateData.name !== undefined) {
    updateDataFiltered.name = updateData.name;
  }
  if (updateData.description !== undefined) {
    updateDataFiltered.description = updateData.description;
  }
  const topicId = topic.id || topic._id;
  const updated = await Topic.update(topicId, updateDataFiltered);
  // Fetch with relation included
  return await Topic.findById(topicId);
};

/**
 * Delete topic
 */
const deleteTopic = async (topicId) => {
  return await Topic.delete(topicId);
};

module.exports = {
  createTopic,
  getAllTopics,
  findTopicById,
  findTopicsByParentSubject,
  findSubjectById,
  updateTopic,
  deleteTopic,
  getTopicsPaginated,
  getTopicsCount,
};

