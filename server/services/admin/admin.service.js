const User = require('../../models/user');
const crypto = require('crypto');

/**
 * Generate a random password
 */
const generatePassword = () => {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(crypto.randomInt(0, charset.length));
  }
  return password;
};

/**
 * Find user by email
 */
const findUserByEmail = async (email) => {
  return await User.findOne({ email: email.toLowerCase().trim() });
};

/**
 * Find user by email excluding a specific user ID
 */
const findUserByEmailExcludingId = async (email, excludeUserId) => {
  return await User.findOne({
    email: email.toLowerCase().trim(),
    _id: { $ne: excludeUserId },
  });
};

/**
 * Create admin user
 */
const createAdminUser = async (userData) => {
  return await User.create(userData);
};

/**
 * Get all admin users
 */
const getAllAdmins = async () => {
  return await User.find({ role: 'admin' }).select('-password -otp -otpExpiry -resetPasswordToken -resetPasswordExpiry');
};

/**
 * Find user by ID
 */
const findUserById = async (userId) => {
  return await User.findById(userId);
};

/**
 * Update user status
 */
const updateUserStatus = async (user, status) => {
  user.status = status;
  return await user.save();
};

/**
 * Update admin core fields
 */
const updateAdminDetails = async (user, updates) => {
  if (updates.name !== undefined) {
    user.name = updates.name;
    user.fullName = updates.name;
  }
  if (updates.email !== undefined) {
    user.email = updates.email;
  }
  if (updates.status !== undefined) {
    user.status = updates.status;
  }
  if (updates.adminRole !== undefined) {
    user.adminRole = updates.adminRole;
  }

  return await user.save();
};

module.exports = {
  generatePassword,
  findUserByEmail,
  findUserByEmailExcludingId,
  createAdminUser,
  getAllAdmins,
  findUserById,
  updateUserStatus,
  updateAdminDetails,
};

