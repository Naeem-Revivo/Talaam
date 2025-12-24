const { prisma } = require('../../config/db/prisma');

/**
 * Question Model using Prisma
 */
const Question = {
  // Create a new question
  async create(data) {
    // Handle history and comments if provided
    const { history, comments, exam, subject, topic, createdBy, assignedProcessor, assignedCreator, assignedExplainer, originalQuestion, ...questionData } = data;
    
    // Map relation fields to Prisma format (exam -> examId, etc.)
    const createData = {
      ...questionData,
      ...(exam && { examId: exam }),
      ...(subject && { subjectId: subject }),
      ...(topic && { topicId: topic }),
      ...(createdBy && { createdById: createdBy }),
      ...(assignedProcessor && { assignedProcessorId: assignedProcessor }),
      ...(assignedCreator && { assignedCreatorId: assignedCreator }),
      ...(assignedExplainer && { assignedExplainerId: assignedExplainer }),
      ...(originalQuestion && { originalQuestionId: originalQuestion }),
      ...(history && history.length > 0 && {
        history: {
          create: history.map(h => {
            const { performedBy, ...historyData } = h;
            return {
              ...historyData,
              ...(performedBy && { performedById: performedBy })
            };
          })
        }
      }),
      ...(comments && comments.length > 0 && {
        comments: {
          create: comments.map(c => {
            const { commentedBy, ...commentData } = c;
            return {
              ...commentData,
              ...(commentedBy && { commentedById: commentedBy })
            };
          })
        }
      })
    };//#endregion

    console.log('createData', createData);
    console.log('history', createData.history);

    return await prisma.question.create({
      data: createData,
      include: {
        exam: true,
        subject: true,
        topic: true,
        createdBy: true,
        assignedProcessor: true
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
        assignedProcessor: true,
        assignedCreator: true,
        assignedExplainer: true,
        flaggedBy: true,
        flagReviewedBy: true,
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
      assignedProcessor: true,
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
        createdBy: true,
        assignedProcessor: true
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
    const { history, comments, exam, subject, topic, createdBy, lastModifiedBy, approvedBy, rejectedBy, assignedProcessor, assignedCreator, assignedExplainer, flaggedBy, flagReviewedBy, ...updateData } = data;
    
    // Map relation fields to Prisma format
    const update = {
      ...updateData,
      ...(exam !== undefined && { examId: exam }),
      ...(subject !== undefined && { subjectId: subject }),
      ...(topic !== undefined && { topicId: topic }),
      ...(createdBy !== undefined && { createdById: createdBy }),
      ...(lastModifiedBy !== undefined && { lastModifiedById: lastModifiedBy }),
      ...(approvedBy !== undefined && { approvedById: approvedBy }),
      ...(rejectedBy !== undefined && { rejectedById: rejectedBy }),
      ...(assignedProcessor !== undefined && { assignedProcessorId: assignedProcessor }),
      ...(assignedCreator !== undefined && { assignedCreatorId: assignedCreator }),
      ...(assignedExplainer !== undefined && { assignedExplainerId: assignedExplainer }),
      ...(flaggedBy !== undefined && { flaggedById: flaggedBy }),
      ...(flagReviewedBy !== undefined && { flagReviewedById: flagReviewedBy }),
      ...(history && history.length > 0 && {
        history: {
          create: history.map(h => {
            const { performedBy, ...historyData } = h;
            return {
              ...historyData,
              ...(performedBy && { performedById: performedBy })
            };
          })
        }
      }),
      ...(comments && comments.length > 0 && {
        comments: {
          create: comments.map(c => {
            const { commentedBy, ...commentData } = c;
            return {
              ...commentData,
              ...(commentedBy && { commentedById: commentedBy })
            };
          })
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
