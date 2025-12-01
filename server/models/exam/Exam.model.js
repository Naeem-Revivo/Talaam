const { prisma } = require('../../config/db/prisma');

/**
 * Exam Model using Prisma
 */
const Exam = {
  // Create a new exam
  async create(data) {
    return await prisma.exam.create({ data });
  },

  // Find exam by ID
  async findById(id) {
    return await prisma.exam.findUnique({ where: { id } });
  },

  // Find all exams
  async findMany(options = {}) {
    return await prisma.exam.findMany(options);
  },

  // Find active exams
  async findActive() {
    return await prisma.exam.findMany({
      where: { status: 'active' },
      orderBy: { name: 'asc' }
    });
  },

  // Update exam
  async update(id, data) {
    return await prisma.exam.update({ where: { id }, data });
  },

  // Delete exam
  async delete(id) {
    return await prisma.exam.delete({ where: { id } });
  },
};

module.exports = Exam;
