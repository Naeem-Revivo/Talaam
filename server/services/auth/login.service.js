const { findUserByEmailWithPassword } = require('./user.service');
const { generateToken } = require('../../config/jwt');

/**
 * Login user
 */
const login = async (email, password) => {
  // Find user and include password
  const user = await findUserByEmailWithPassword(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Ensure password exists and is valid (handle Prisma serialization issues in serverless)
  if (!user.password) {
    throw new Error('Invalid email or password');
  }

  // Ensure password is a string (handle cases where Prisma returns object)
  const hashedPassword = typeof user.password === 'string' 
    ? user.password 
    : String(user.password || '');
  
  // Ensure candidate password is a string
  const candidatePassword = typeof password === 'string' 
    ? password 
    : String(password || '');

  // Check password
  const UserModel = require('../../models/user');
  const isPasswordValid = await UserModel.comparePassword(hashedPassword, candidatePassword);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Check if user is suspended
  if (user.status === 'suspended') {
    throw new Error('Account suspended. Please contact support team.');
  }

  // Generate token
  const token = generateToken(user.id);

  return {
    user,
    token,
  };
};

module.exports = {
  login,
};

