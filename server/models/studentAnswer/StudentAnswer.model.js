const { prisma } = require('../../config/db/prisma');

/**
 * StudentAnswer Model using Prisma
 */
const StudentAnswer = {
  // Create a new student answer
  async create(data) {
    const { answers, ...studentAnswerData } = data;
    
    // Map Mongoose-style field names to Prisma field names
    const prismaData = {
      studentId: data.student || data.studentId,
      mode: data.mode,
      examId: data.exam || data.examId,
      subjectId: data.subject || data.subjectId || null,
      topicId: data.topic || data.topicId || null,
      questionId: data.question || data.questionId || null,
      selectedAnswer: data.selectedAnswer || '',
      isCorrect: data.isCorrect || false,
      totalQuestions: data.totalQuestions || 0,
      correctAnswers: data.correctAnswers || 0,
      incorrectAnswers: data.incorrectAnswers || 0,
      score: data.score || 0,
      percentage: data.percentage || 0,
      status: data.status || 'completed',
    };

    // Only include timeTaken if it's provided (not undefined)
    if (data.timeTaken !== undefined && data.timeTaken !== null) {
      prismaData.timeTaken = data.timeTaken;
    }

    // Only include remainingTime if it's provided (not undefined)
    if (data.remainingTime !== undefined && data.remainingTime !== null) {
      prismaData.remainingTime = data.remainingTime;
    }

    // Only include timeLimit if it's provided (not undefined)
    if (data.timeLimit !== undefined && data.timeLimit !== null) {
      prismaData.timeLimit = data.timeLimit;
    }

    // Remove undefined values
    Object.keys(prismaData).forEach(key => {
      if (prismaData[key] === undefined) {
        delete prismaData[key];
      }
    });

    const result = await prisma.studentAnswer.create({
      data: prismaData,
      include: {
        student: true,
        exam: true,
        subject: true,
        topic: true,
        question: true,
        answers: {
          include: { question: true }
        }
      }
    });

    // If answers array is provided, create related StudentAnswerQuestion records
    if (answers && Array.isArray(answers) && answers.length > 0) {
      await Promise.all(
        answers.map(answer => {
          const questionId = answer.question || answer.questionId;
          if (!questionId) {
            console.warn('Skipping answer with missing questionId:', answer);
            return null;
          }
          return prisma.studentAnswerQuestion.create({
            data: {
              studentAnswerId: result.id,
              questionId: questionId,
              selectedAnswer: answer.selectedAnswer || '', // Empty string for unanswered (not null)
              isCorrect: answer.isCorrect || false,
            }
          });
        }).filter(Boolean) // Remove any null values
      );
      
      // Reload with answers
      return await prisma.studentAnswer.findUnique({
        where: { id: result.id },
        include: {
          student: true,
          exam: true,
          subject: true,
          topic: true,
          question: true,
          answers: {
            include: { question: true }
          }
        }
      });
    }

    return result;
  },

  // Find student answer by ID
  async findById(id) {
    return await prisma.studentAnswer.findUnique({ 
      where: { id },
      include: {
        student: true,
        exam: true,
        subject: true,
        topic: true,
        question: true,
        answers: {
          include: { question: true }
        }
      }
    });
  },

  // Find one student answer (Mongoose compatibility)
  async findOne(query = {}) {
    const where = this._convertQuery(query);
    return await prisma.studentAnswer.findFirst({
      where,
      include: {
        student: true,
        exam: true,
        subject: true,
        topic: true,
        question: true,
        answers: {
          include: { question: true }
        }
      }
    });
  },

  // Find all student answers with filters (Mongoose compatibility)
  async find(query = {}) {
    const where = this._convertQuery(query);
    return await prisma.studentAnswer.findMany({
      where,
      include: {
        student: true,
        exam: true,
        subject: true,
        topic: true,
        question: true,
        answers: {
          include: { question: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  // Find all student answers with filters
  async findMany(options = {}) {
    const { include = {}, where = {}, ...restOptions } = options;
    const defaultInclude = {
      student: true,
      exam: true,
      subject: true,
      topic: true,
      question: true,
      answers: {
        include: { question: true }
      },
      ...include
    };

    return await prisma.studentAnswer.findMany({
      where,
      include: defaultInclude,
      ...restOptions
    });
  },

  // Find answers by student ID
  async findByStudentId(studentId, options = {}) {
    return await prisma.studentAnswer.findMany({
      where: { studentId },
      include: {
        exam: true,
        subject: true,
        topic: true,
        question: true,
        answers: {
          include: { question: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      ...options
    });
  },

  // Find answers by student and exam
  async findByStudentAndExam(studentId, examId, options = {}) {
    return await prisma.studentAnswer.findMany({
      where: {
        studentId,
        examId
      },
      include: {
        exam: true,
        subject: true,
        topic: true,
        question: true,
        answers: {
          include: { question: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      ...options
    });
  },

  // Find answers by student and mode
  async findByStudentAndMode(studentId, mode, options = {}) {
    return await prisma.studentAnswer.findMany({
      where: {
        studentId,
        mode
      },
      include: {
        exam: true,
        subject: true,
        topic: true,
        question: true,
        answers: {
          include: { question: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      ...options
    });
  },

  // Get distinct student IDs (Mongoose compatibility)
  async distinct(field) {
    const fieldName = field === 'student' ? 'studentId' : field;
    
    // Use groupBy to get distinct values
    if (fieldName === 'studentId') {
      const results = await prisma.studentAnswer.groupBy({
        by: ['studentId'],
        _count: { studentId: true }
      });
      return results.map(r => r.studentId);
    }
    
    // For other fields, use findMany and filter
    const results = await prisma.studentAnswer.findMany({
      select: { [fieldName]: true }
    });
    const uniqueValues = [...new Set(results.map(r => r[fieldName]).filter(v => v !== null))];
    return uniqueValues;
  },

  // Count documents (Mongoose compatibility)
  async countDocuments(query = {}) {
    const where = this._convertQuery(query);
    return await prisma.studentAnswer.count({ where });
  },

  // Aggregate (Mongoose compatibility - basic support)
  async aggregate(pipeline = []) {
    // Basic aggregation support - may need enhancement based on usage
    // For now, return empty array as Prisma doesn't have direct aggregation
    // This should be replaced with Prisma's groupBy or raw queries
    console.warn('StudentAnswer.aggregate() called - may need Prisma groupBy or raw query');
    return [];
  },

  // Update student answer
  async update(id, data) {
    const { answers, ...updateData } = data;
    
    // Map field names if needed
    const prismaUpdateData = {};
    if (updateData.student !== undefined) prismaUpdateData.studentId = updateData.student;
    if (updateData.exam !== undefined) prismaUpdateData.examId = updateData.exam;
    if (updateData.subject !== undefined) prismaUpdateData.subjectId = updateData.subject;
    if (updateData.topic !== undefined) prismaUpdateData.topicId = updateData.topic;
    if (updateData.question !== undefined) prismaUpdateData.questionId = updateData.question;
    
    // Copy other fields
    Object.keys(updateData).forEach(key => {
      if (!['student', 'exam', 'subject', 'topic', 'question'].includes(key)) {
        prismaUpdateData[key] = updateData[key];
      }
    });

    const update = {
      ...prismaUpdateData,
      ...(answers && Array.isArray(answers) && answers.length > 0 && {
        answers: {
          deleteMany: {},
          create: answers.map(answer => ({
            questionId: answer.question || answer.questionId,
            selectedAnswer: answer.selectedAnswer,
            isCorrect: answer.isCorrect || false,
          }))
        }
      })
    };

    return await prisma.studentAnswer.update({
      where: { id },
      data: update,
      include: {
        student: true,
        exam: true,
        subject: true,
        topic: true,
        question: true,
        answers: {
          include: { question: true }
        }
      }
    });
  },

  // Delete student answer
  async delete(id) {
    return await prisma.studentAnswer.delete({ where: { id } });
  },

  // Helper method to convert Mongoose-style queries to Prisma where clauses
  _convertQuery(query) {
    const where = {};
    
    if (query._id) {
      where.id = query._id;
    }
    if (query.student) {
      where.studentId = query.student;
    }
    if (query.exam) {
      where.examId = query.exam;
    }
    if (query.subject) {
      where.subjectId = query.subject;
    }
    if (query.topic) {
      where.topicId = query.topic;
    }
    if (query.question) {
      where.questionId = query.question;
    }
    if (query.mode) {
      where.mode = query.mode;
    }
    if (query.status) {
      where.status = query.status;
    }
    if (query.studentId) {
      where.studentId = query.studentId;
    }
    if (query.examId) {
      where.examId = query.examId;
    }

    return where;
  },
};

module.exports = StudentAnswer;
