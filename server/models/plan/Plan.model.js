const { prisma } = require('../../config/db/prisma');

/**
 * Plan Model using Prisma
 */
const Plan = {
  // Create a new plan
  async create(data) {
    return await prisma.plan.create({ data });
  },

  // Find plan by ID
  async findById(id) {
    return await prisma.plan.findUnique({ 
      where: { id },
      include: { subscriptions: true }
    });
  },

  // Find all plans
  async findMany(options = {}) {
    return await prisma.plan.findMany(options);
  },

  // Find active plans
  async findActive() {
    return await prisma.plan.findMany({
      where: { status: 'active' },
      orderBy: { price: 'asc' }
    });
  },

  // Update plan
  async update(id, data) {
    return await prisma.plan.update({ where: { id }, data });
  },

  // Delete plan
  async delete(id) {
    return await prisma.plan.delete({ where: { id } });
  },
};

module.exports = Plan;
