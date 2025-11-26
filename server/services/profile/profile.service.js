const User = require('../../models/user');

/**
 * Get user profile by ID
 */
const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

/**
 * Update user profile
 */
const updateProfile = async (userId, profileData) => {
  const { fullName, dateOfBirth, country, timezone, language } = profileData;

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Update profile fields
  if (fullName !== undefined) user.fullName = fullName;
  if (dateOfBirth !== undefined) {
    // Handle dateOfBirth - can be string (DD/MM/YYYY) or Date object
    if (typeof dateOfBirth === 'string') {
      // Parse DD/MM/YYYY format
      const dateParts = dateOfBirth.split('/');
      if (dateParts.length === 3) {
        const day = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed
        const year = parseInt(dateParts[2], 10);
        user.dateOfBirth = new Date(year, month, day);
      } else {
        user.dateOfBirth = new Date(dateOfBirth);
      }
    } else if (dateOfBirth) {
      user.dateOfBirth = new Date(dateOfBirth);
    } else {
      user.dateOfBirth = null;
    }
  }
  if (country !== undefined) user.country = country;
  if (timezone !== undefined) user.timezone = timezone;
  if (language !== undefined) user.language = language;

  // Also update name field if fullName is provided (for backward compatibility)
  if (fullName) {
    user.name = fullName;
  }

  await user.save();
  return user;
};

/**
 * Complete user profile (for initial setup)
 */
const completeProfile = async (userId, profileData) => {
  const { fullName, dateOfBirth, country, timezone, language } = profileData;

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Update profile fields
  if (fullName) user.fullName = fullName;
  if (dateOfBirth) {
    // Handle dateOfBirth - can be string (DD/MM/YYYY) or Date object
    if (typeof dateOfBirth === 'string') {
      // Parse DD/MM/YYYY format
      const dateParts = dateOfBirth.split('/');
      if (dateParts.length === 3) {
        const day = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed
        const year = parseInt(dateParts[2], 10);
        user.dateOfBirth = new Date(year, month, day);
      } else {
        user.dateOfBirth = new Date(dateOfBirth);
      }
    } else {
      user.dateOfBirth = new Date(dateOfBirth);
    }
  }
  if (country) user.country = country;
  if (timezone) user.timezone = timezone;
  if (language) user.language = language;

  // Also update name field if fullName is provided
  if (fullName) {
    user.name = fullName;
  }

  await user.save();
  return user;
};

module.exports = {
  getProfile,
  updateProfile,
  completeProfile,
};

