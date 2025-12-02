const { prisma } = require('../../config/db/prisma');

/**
 * Subscription Model using Prisma
 */
const Subscription = {
  // Create a new subscription
  async create(data) {
    return await prisma.subscription.create({ data });
  },

  // Find subscription by ID
  async findById(id) {
    return await prisma.subscription.findUnique({ 
      where: { id },
      include: { user: true, plan: true }
    });
  },

  // Find subscriptions by user ID
  async findByUserId(userId, options = {}) {
    return await prisma.subscription.findMany({
      where: { userId },
      include: { plan: true },
      ...options
    });
  },

  // Find active subscription for user
  async findActiveByUserId(userId) {
    return await prisma.subscription.findFirst({
      where: {
        userId,
        isActive: true,
        expiryDate: { gte: new Date() }
      },
      include: { plan: true },
      orderBy: { expiryDate: 'desc' }
    });
  },

  // Update subscription
  async update(id, data) {
    return await prisma.subscription.update({ where: { id }, data });
  },

  // Delete subscription
  async delete(id) {
    return await prisma.subscription.delete({ where: { id } });
  },

  // Find all subscriptions with filters
  async findMany(options = {}) {
    return await prisma.subscription.findMany({
      include: { user: true, plan: true },
      ...options
    });
  },

  // Find expired subscriptions
  async findExpired() {
    return await prisma.subscription.findMany({
      where: {
        isActive: true,
        expiryDate: { lt: new Date() }
      },
      include: { user: true, plan: true }
    });
  },
};

module.exports = Subscription;
