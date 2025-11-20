const Topic = require('../../models/topic');
const Subject = require('../../models/subject');

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
 * Find topics by parent subject ID
 */
const findTopicsByParentSubject = async (parentSubjectId) => {
  return await Topic.find({ parentSubject: parentSubjectId }).populate('parentSubject', 'name').sort({ createdAt: -1 });
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
};

