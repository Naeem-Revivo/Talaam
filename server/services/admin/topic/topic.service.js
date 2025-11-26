const Topic = require('../../../models/topic');
const Subject = require('../../../models/subject');

/**
 * Create topic
 */
const createTopic = async (topicData) => {
  return await Topic.create(topicData);
};

/**
 * Get all topics with optional filter by parent subject
 */
const getAllTopics = async (filter = {}) => {
  return await Topic.find(filter).populate('parentSubject', 'name').sort({ createdAt: -1 });
};

/**
 * Find topic by ID
 */
const findTopicById = async (topicId) => {
  return await Topic.findById(topicId).populate('parentSubject', 'name');
};

/**
 * Find topics by parent subject ID with optional search
 */
const findTopicsByParentSubject = async (parentSubjectId, search = null) => {
  const query = { parentSubject: parentSubjectId };
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }
  
  return await Topic.find(query).populate('parentSubject', 'name').sort({ createdAt: -1 });
};

/**
 * Get paginated topics with search
 */
const getTopicsPaginated = async (filters = {}, pagination = {}) => {
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
  const totalItems = await Topic.countDocuments(query);

  // Get paginated results
  const topics = await Topic.find(query)
    .populate('parentSubject', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

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
  return await Topic.countDocuments();
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
  if (updateData.parentSubject !== undefined) {
    topic.parentSubject = updateData.parentSubject;
  }
  if (updateData.name !== undefined) {
    topic.name = updateData.name;
  }
  if (updateData.description !== undefined) {
    topic.description = updateData.description;
  }
  return await topic.save();
};

/**
 * Delete topic
 */
const deleteTopic = async (topicId) => {
  return await Topic.findByIdAndDelete(topicId);
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

