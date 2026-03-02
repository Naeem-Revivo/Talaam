const { prisma } = require('../../config/db/prisma');
const bcrypt = require('bcryptjs');
const { generateShortId } = require('../../utils/shortId');

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
    // Normalize email to lowercase and trim (preserve + aliases)
    if (data.email) {
      data.email = data.email.trim().toLowerCase();
    }
    
    // Generate short_id if not provided
    if (!data.shortId) {
      data.shortId = generateShortId();
    }
    
    return await prisma.user.create({ data });
  },

  // Find user by ID
  async findById(id) {
    return await prisma.user.findUnique({ where: { id } });
  },

  // Find user by email
  async findByEmail(email) {
    // Normalize email to lowercase and trim (preserve + aliases)
    const normalizedEmail = email ? email.trim().toLowerCase() : email;
    return await prisma.user.findFirst({ where: { email: normalizedEmail } });
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
    // Ensure both arguments are strings (handle Prisma serialization issues in serverless)
    const hashed = typeof hashedPassword === 'string' 
      ? hashedPassword 
      : String(hashedPassword || '');
    const candidate = typeof candidatePassword === 'string' 
      ? candidatePassword 
      : String(candidatePassword || '');
    
    // Validate that we have valid strings before comparing
    if (!hashed || !candidate) {
      return false;
    }
    
    return await bcrypt.compare(candidate, hashed);
  },
};

module.exports = User;
