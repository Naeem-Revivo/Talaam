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

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Check if user is suspended
  if (user.status === 'suspended') {
    throw new Error('Your account has been suspended. Please contact administrator.');
  }

  // Generate token
  const token = generateToken(user._id);

  return {
    user,
    token,
  };
};

module.exports = {
  login,
};

