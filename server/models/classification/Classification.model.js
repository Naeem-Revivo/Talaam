const { prisma } = require('../../config/db/prisma');

/**
 * Classification Model using Prisma
 */
const Classification = {
  // Create a new classification
  async create(data) {
    return await prisma.classification.create({ data });
  },

  // Find classification by ID
  async findById(id) {
    return await prisma.classification.findUnique({ 
      where: { id },
      include: { exam: true, subject: true, topic: true }
    });
  },

  // Find classification by exam, subject, and topic
  async findByExamSubjectTopic(examId, subjectId, topicId) {
    return await prisma.classification.findUnique({
      where: {
        examId_subjectId_topicId: {
          examId,
          subjectId,
          topicId
        }
      },
      include: { exam: true, subject: true, topic: true }
    });
  },

  // Find all classifications
  async findMany(options = {}) {
    return await prisma.classification.findMany({
      include: { exam: true, subject: true, topic: true },
      ...options
    });
  },

  // Find active classifications
  async findActive() {
    return await prisma.classification.findMany({
      where: { status: 'active' },
      include: { exam: true, subject: true, topic: true }
    });
  },

  // Update classification
  async update(id, data) {
    return await prisma.classification.update({ where: { id }, data });
  },

  // Delete classification
  async delete(id) {
    return await prisma.classification.delete({ where: { id } });
  },
};

module.exports = Classification;
