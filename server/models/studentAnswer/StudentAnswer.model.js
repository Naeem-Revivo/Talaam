const { prisma } = require('../../config/db/prisma');

/**
 * StudentAnswer Model using Prisma
 */
const StudentAnswer = {
  // Create a new student answer
  async create(data) {
    // Handle answers array if provided (for test mode)
    const { answers, ...answerData } = data;
    
    const createData = {
      ...answerData,
      ...(answers && answers.length > 0 && {
        answers: {
          create: answers
        }
      })
    };

    return await prisma.studentAnswer.create({
      data: createData,
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

  // Find all student answers with filters
  async findMany(options = {}) {
    const { include = {}, ...restOptions } = options;
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

  // Update student answer
  async update(id, data) {
    const { answers, ...updateData } = data;
    
    const update = {
      ...updateData,
      ...(answers && answers.length > 0 && {
        answers: {
          deleteMany: {},
          create: answers
        }
      })
    };

    return await prisma.studentAnswer.update({
      where: { id },
      data: update,
      include: {
        student: true,
        exam: true,
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
};

module.exports = StudentAnswer;
