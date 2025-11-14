const User = require('../models/User.model');

// Get user profile
exports.getProfile = async (req, res, next) => {
  try {
    console.log('[PROFILE] GET /profile → requested', { userId: req.user && req.user.id });
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const response = {
      success: true,
      data: {
        profile: {
          fullName: user.fullName,
          dateOfBirth: user.dateOfBirth,
          country: user.country,
          timezone: user.timezone,
          language: user.language,
          email: user.email,
        },
      },
    };
    console.log('[PROFILE] GET /profile → 200 (ok)', { userId: user._id, response });
    res.status(200).json(response);
  } catch (error) {
    console.error('[PROFILE] GET /profile → error', error);
    next(error);
  }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    console.log('[PROFILE] PUT /profile → requested', { userId: req.user && req.user.id });
    const { fullName, dateOfBirth, country, timezone, language } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
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

    const response = {
      success: true,
      message: 'Profile updated successfully',
      data: {
        profile: {
          fullName: user.fullName,
          dateOfBirth: user.dateOfBirth,
          country: user.country,
          timezone: user.timezone,
          language: user.language,
          email: user.email,
        },
      },
    };
    console.log('[PROFILE] PUT /profile → 200 (updated)', { userId: user._id, response });
    res.status(200).json(response);
  } catch (error) {
    console.error('[PROFILE] PUT /profile → error', error);
    next(error);
  }
};

// Create/Complete profile (for initial setup)
exports.completeProfile = async (req, res, next) => {
  try {
    console.log('[PROFILE] POST /profile/complete → requested', { userId: req.user && req.user.id });
    const { fullName, dateOfBirth, country, timezone, language } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
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

    const response = {
      success: true,
      message: 'Profile completed successfully',
      data: {
        profile: {
          fullName: user.fullName,
          dateOfBirth: user.dateOfBirth,
          country: user.country,
          timezone: user.timezone,
          language: user.language,
          email: user.email,
        },
      },
    };
    console.log('[PROFILE] POST /profile/complete → 200 (completed)', { userId: user._id, response });
    res.status(200).json(response);
  } catch (error) {
    console.error('[PROFILE] POST /profile/complete → error', error);
    next(error);
  }
};
