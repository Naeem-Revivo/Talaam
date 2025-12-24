const { prisma } = require('../../config/db/prisma');

/**
 * Language Model using Prisma
 */
const Language = {
  // Create a new language
  async create(data) {
    // If setting as default, unset other defaults
    if (data.isDefault) {
      await prisma.language.updateMany({
        where: { isDefault: true },
        data: { isDefault: false }
      });
    }
    return await prisma.language.create({ data });
  },

  // Find language by ID
  async findById(id) {
    return await prisma.language.findUnique({ 
      where: { id }
    });
  },

  // Find language by code
  async findByCode(code) {
    return await prisma.language.findUnique({ 
      where: { code }
    });
  },

  // Find all languages
  async findMany(options = {}) {
    return await prisma.language.findMany({
      ...options,
      orderBy: { createdAt: 'desc' }
    });
  },

  // Find active languages
  async findActive() {
    return await prisma.language.findMany({
      where: { status: 'active' },
      orderBy: { name: 'asc' }
    });
  },

  // Find default language
  async findDefault() {
    return await prisma.language.findFirst({
      where: { isDefault: true, status: 'active' }
    });
  },

  // Update language
  async update(id, data) {
    // If setting as default, unset other defaults
    if (data.isDefault) {
      await prisma.language.updateMany({
        where: { 
          isDefault: true,
          id: { not: id }
        },
        data: { isDefault: false }
      });
    }
    return await prisma.language.update({ where: { id }, data });
  },

  // Delete language
  async delete(id) {
    return await prisma.language.delete({ where: { id } });
  },

  // Count languages
  async count(where = {}) {
    return await prisma.language.count({ where });
  },
};

module.exports = Language;
