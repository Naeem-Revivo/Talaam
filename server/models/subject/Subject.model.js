const { prisma } = require('../../config/db/prisma');

/**
 * Subject Model using Prisma
 */
const Subject = {
  // Create a new subject
  async create(data) {
    return await prisma.subject.create({ data });
  },

  // Find subject by ID
  async findById(id) {
    return await prisma.subject.findUnique({ 
      where: { id },
      include: { topics: true }
    });
  },

  // Find all subjects
  async findMany(options = {}) {
    return await prisma.subject.findMany({
      include: { topics: true },
      ...options
    });
  },

  // Update subject
  async update(id, data) {
    return await prisma.subject.update({ where: { id }, data });
  },

  // Delete subject
  async delete(id) {
    return await prisma.subject.delete({ where: { id } });
  },
};

module.exports = Subject;
