const { prisma } = require('../../config/db/prisma');
const bcrypt = require('bcryptjs');

/**
 * User Model using Prisma
 */
const User = {
  // Create a new user
  async create(data) {
    // Hash password if provided
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 12);
    }
    return await prisma.user.create({ data });
  },

  // Find user by ID
  async findById(id) {
    return await prisma.user.findUnique({ where: { id } });
  },

  // Find user by email
  async findByEmail(email) {
    return await prisma.user.findFirst({ where: { email: email.toLowerCase() } });
  },

  // Find user by Google ID
  async findByGoogleId(googleId) {
    return await prisma.user.findUnique({ where: { googleId } });
  },

  // Find user by LinkedIn ID
  async findByLinkedInId(linkedinId) {
    return await prisma.user.findUnique({ where: { linkedinId } });
  },

  // Update user
  async update(id, data) {
    // Hash password if being updated
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 12);
    }
    return await prisma.user.update({ where: { id }, data });
  },

  // Delete user
  async delete(id) {
    return await prisma.user.delete({ where: { id } });
  },

  // Find all users with filters
  async findMany(options = {}) {
    return await prisma.user.findMany(options);
  },

  // Find user with relations
  async findByIdWithRelations(id, include = {}) {
    return await prisma.user.findUnique({ where: { id }, include });
  },

  // Compare password
  async comparePassword(hashedPassword, candidatePassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  },
};

module.exports = User;
