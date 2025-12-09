const { findUserByEmail, createUser } = require('./user.service');
const { generateToken } = require('../../config/jwt');

/**
 * Signup a new user
 */
const signup = async (email, password, otp, otpExpiry, role = 'student') => {
  // Normalize email to lowercase and trim (preserve + aliases)
  const normalizedEmail = email ? email.trim().toLowerCase() : email;

  // Check if user already exists
  const existingUser = await findUserByEmail(normalizedEmail);
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  // Validate role
  if (role && !['student', 'admin'].includes(role)) {
    throw new Error('Invalid role. Role must be either student or admin');
  }

  // Create user data
  const userData = {
    email: normalizedEmail,
    password,
    otp,
    otpExpiry,
    role: role || 'student',
  };

  // If role is admin, set default adminRole to null (superadmin will assign later)
  if (role === 'admin') {
    userData.adminRole = null;
  }

  // Create user
  const user = await createUser(userData);

  // Generate token
  const token = generateToken(user.id);

  return {
    user,
    token,
  };
};

module.exports = {
  signup,
};

