const { prisma } = require('../../config/db/prisma');

/**
 * Question Model using Prisma
 */
const Question = {
  // Create a new question
  async create(data) {
    // Handle history and comments if provided
    const { history, comments, ...questionData } = data;
    
    const createData = {
      ...questionData,
      ...(history && history.length > 0 && {
        history: {
          create: history
        }
      }),
      ...(comments && comments.length > 0 && {
        comments: {
          create: comments
        }
      })
    };

    return await prisma.question.create({
      data: createData,
      include: {
        exam: true,
        subject: true,
        topic: true,
        createdBy: true
      }
    });
  },

  // Find question by ID
  async findById(id) {
    return await prisma.question.findUnique({ 
      where: { id },
      include: {
        exam: true,
        subject: true,
        topic: true,
        createdBy: true,
        lastModifiedBy: true,
        approvedBy: true,
        rejectedBy: true,
        originalQuestion: true,
        variants: true,
        history: {
          include: { performedBy: true },
          orderBy: { timestamp: 'desc' }
        },
        comments: {
          include: { commentedBy: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  },

  // Find all questions with filters
  async findMany(options = {}) {
    const { include = {}, ...restOptions } = options;
    const defaultInclude = {
      exam: true,
      subject: true,
      topic: true,
      createdBy: true,
      ...include
    };

    return await prisma.question.findMany({
      include: defaultInclude,
      ...restOptions
    });
  },

  // Find questions by status
  async findByStatus(status, options = {}) {
    return await prisma.question.findMany({
      where: { status },
      include: {
        exam: true,
        subject: true,
        topic: true,
        createdBy: true
      },
      ...options
    });
  },

  // Find questions by exam, subject, topic
  async findByExamSubjectTopic(examId, subjectId, topicId, options = {}) {
    return await prisma.question.findMany({
      where: {
        examId,
        subjectId,
        topicId
      },
      include: {
        exam: true,
        subject: true,
        topic: true,
        createdBy: true
      },
      ...options
    });
  },

  // Update question
  async update(id, data) {
    const { history, comments, ...updateData } = data;
    
    const update = {
      ...updateData,
      ...(history && history.length > 0 && {
        history: {
          create: history
        }
      }),
      ...(comments && comments.length > 0 && {
        comments: {
          create: comments
        }
      })
    };

    return await prisma.question.update({
      where: { id },
      data: update,
      include: {
        exam: true,
        subject: true,
        topic: true
      }
    });
  },

  // Delete question
  async delete(id) {
    return await prisma.question.delete({ where: { id } });
  },

  // Add history entry
  async addHistory(questionId, historyData) {
    return await prisma.questionHistory.create({
      data: {
        questionId,
        ...historyData
      },
      include: { performedBy: true }
    });
  },

  // Add comment
  async addComment(questionId, commentData) {
    return await prisma.questionComment.create({
      data: {
        questionId,
        ...commentData
      },
      include: { commentedBy: true }
    });
  },
};

module.exports = Question;
