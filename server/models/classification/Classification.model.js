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

  // Upsert classification (findOneAndUpdate equivalent)
  async findOneAndUpdate(where, update, options = {}) {
    // Map field names: exam/subject/topic -> examId/subjectId/topicId
    const examId = where.exam || where.examId;
    const subjectId = where.subject || where.subjectId;
    const topicId = where.topic || where.topicId;
    
    const updateExamId = update.exam || update.examId || examId;
    const updateSubjectId = update.subject || update.subjectId || subjectId;
    const updateTopicId = update.topic || update.topicId || topicId;
    const { exam, subject, topic, examId: _, subjectId: __, topicId: ___, ...updateData } = update;
    
    // Use Prisma upsert for findOneAndUpdate with upsert: true
    if (options.upsert) {
      return await prisma.classification.upsert({
        where: {
          examId_subjectId_topicId: {
            examId,
            subjectId,
            topicId,
          }
        },
        update: {
          ...updateData,
          examId: updateExamId,
          subjectId: updateSubjectId,
          topicId: updateTopicId,
        },
        create: {
          examId: updateExamId,
          subjectId: updateSubjectId,
          topicId: updateTopicId,
          ...updateData,
        },
        include: { exam: true, subject: true, topic: true }
      });
    } else {
      // If not upsert, just update
      const existing = await prisma.classification.findUnique({
        where: {
          examId_subjectId_topicId: {
            examId,
            subjectId,
            topicId,
          }
        }
      });
      
      if (!existing) {
        return null;
      }
      
      return await prisma.classification.update({
        where: { id: existing.id },
        data: {
          ...updateData,
          examId: updateExamId,
          subjectId: updateSubjectId,
          topicId: updateTopicId,
        },
        include: { exam: true, subject: true, topic: true }
      });
    }
  },

  // Delete classification
  async delete(id) {
    return await prisma.classification.delete({ where: { id } });
  },
};

module.exports = Classification;
