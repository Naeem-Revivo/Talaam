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
  const { fullName, name, dateOfBirth, phone, country, timezone, language, email } = profileData;

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Prepare update data
  const updateData = {};

  if (fullName !== undefined || name !== undefined) {
    const nameValue = fullName || name;
    updateData.fullName = nameValue;
    updateData.name = nameValue; // Also update name field for backward compatibility
  }
  
  if (email !== undefined) {
    updateData.email = email.trim().toLowerCase();
  }
  
  if (phone !== undefined) {
    updateData.phone = phone || null; // Allow empty string to be set to null
  }
  
  if (dateOfBirth !== undefined) {
    // Handle dateOfBirth - can be string (DD/MM/YYYY) or Date object
    if (typeof dateOfBirth === 'string') {
      // Parse DD/MM/YYYY format
      const dateParts = dateOfBirth.split('/');
      if (dateParts.length === 3) {
        const day = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed
        const year = parseInt(dateParts[2], 10);
        updateData.dateOfBirth = new Date(year, month, day);
      } else {
        updateData.dateOfBirth = new Date(dateOfBirth);
      }
    } else if (dateOfBirth) {
      updateData.dateOfBirth = new Date(dateOfBirth);
    } else {
      updateData.dateOfBirth = null;
    }
  }
  
  if (country !== undefined) updateData.country = country;
  if (timezone !== undefined) updateData.timezone = timezone;
  if (language !== undefined) {
    // Normalize language codes to full names for database storage
    if (language === 'en') {
      updateData.language = 'English';
    } else if (language === 'ar') {
      updateData.language = 'العربية';
    } else {
      updateData.language = language;
    }
  }

  const updatedUser = await User.update(userId, updateData);
  return updatedUser;
};

/**
 * Complete user profile (for initial setup)
 */
const completeProfile = async (userId, profileData) => {
  const { fullName, dateOfBirth, phone, country, timezone, language } = profileData;

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Prepare update data
  const updateData = {};

  if (fullName) {
    updateData.fullName = fullName;
    updateData.name = fullName; // Also update name field
  }
  
  if (phone !== undefined) {
    updateData.phone = phone || null;
  }
  
  if (dateOfBirth) {
    // Handle dateOfBirth - can be string (DD/MM/YYYY) or Date object
    if (typeof dateOfBirth === 'string') {
      // Parse DD/MM/YYYY format
      const dateParts = dateOfBirth.split('/');
      if (dateParts.length === 3) {
        const day = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed
        const year = parseInt(dateParts[2], 10);
        updateData.dateOfBirth = new Date(year, month, day);
      } else {
        updateData.dateOfBirth = new Date(dateOfBirth);
      }
    } else {
      updateData.dateOfBirth = new Date(dateOfBirth);
    }
  }
  
  if (country) updateData.country = country;
  if (timezone) updateData.timezone = timezone;
  if (language) {
    // Normalize language codes to full names for database storage
    if (language === 'en') {
      updateData.language = 'English';
    } else if (language === 'ar') {
      updateData.language = 'العربية';
    } else {
      updateData.language = language;
    }
  }

  const updatedUser = await User.update(userId, updateData);
  return updatedUser;
};

module.exports = {
  getProfile,
  updateProfile,
  completeProfile,
};

