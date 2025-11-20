const User = require('../../models/user');

/**
 * Check if user exists by email
 */
const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

/**
 * Create a new user
 */
const createUser = async (userData) => {
  return await User.create(userData);
};

/**
 * Find user by ID
 */
const findUserById = async (userId) => {
  return await User.findById(userId);
};

/**
 * Find user by email with password field
 */
const findUserByEmailWithPassword = async (email) => {
  return await User.findOne({ email }).select('+password');
};

/**
 * Get current user by ID
 */
const getCurrentUser = async (userId) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

module.exports = {
  findUserByEmail,
  createUser,
  findUserById,
  findUserByEmailWithPassword,
  getCurrentUser,
};

