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

module.exports = {
  generatePassword,
  findUserByEmail,
  createAdminUser,
  getAllAdmins,
  findUserById,
  updateUserStatus,
};

