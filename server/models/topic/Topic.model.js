const { prisma } = require('../../config/db/prisma');

/**
 * Topic Model using Prisma
 */
const Topic = {
  // Create a new topic
  async create(data) {
    return await prisma.topic.create({ data });
  },

  // Find topic by ID
  async findById(id) {
    return await prisma.topic.findUnique({ 
      where: { id },
      include: { subject: true }
    });
  },

  // Find all topics
  async findMany(options = {}) {
    return await prisma.topic.findMany({
      include: { subject: true },
      ...options
    });
  },

  // Find topics by subject
  async findBySubject(subjectId) {
    return await prisma.topic.findMany({
      where: { parentSubject: subjectId },
      include: { subject: true }
    });
  },

  // Update topic
  async update(id, data) {
    return await prisma.topic.update({ where: { id }, data });
  },

  // Delete topic
  async delete(id) {
    return await prisma.topic.delete({ where: { id } });
  },
};

module.exports = Topic;
