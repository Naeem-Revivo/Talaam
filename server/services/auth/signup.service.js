const { findUserByEmail, createUser } = require('./user.service');
const { generateToken } = require('../../config/jwt');

/**
 * Signup a new user
 */
const signup = async (email, password, otp, otpExpiry, role = 'student', country, language, fullName) => {
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

  const derivedName = fullName
  ? fullName.trim().split(/\s+/)[0]
  : null;

  // Create user data
  const userData = {
    email: normalizedEmail,
    password,
    otp,
    otpExpiry,
    role: role || 'student',
    country: country || 'unspecified',
    language: language || 'en',
    fullName: fullName || null,
    name: derivedName || null,
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

