const profileService = require('../../services/profile');

// Get user profile
const getProfile = async (req, res, next) => {
  try {
    console.log('[PROFILE] GET /profile → requested', { userId: req.user && req.user.id });
    const user = await profileService.getProfile(req.user.id);

    // Normalize language from database format to frontend format
    let normalizedLanguage = user.language;
    if (user.language === 'English') {
      normalizedLanguage = 'en';
    } else if (user.language === 'العربية') {
      normalizedLanguage = 'ar';
    }

    const response = {
      success: true,
      data: {
        profile: {
          fullName: user.fullName,
          dateOfBirth: user.dateOfBirth,
          phone: user.phone,
          country: user.country,
          timezone: user.timezone,
          language: normalizedLanguage,
          email: user.email,
        },
      },
    };
    console.log('[PROFILE] GET /profile → 200 (ok)', { userId: user.id, response });
    res.status(200).json(response);
  } catch (error) {
    console.error('[PROFILE] GET /profile → error', error);
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

// Update user profile
const updateProfile = async (req, res, next) => {
  try {
    console.log('[PROFILE] PUT /profile → requested', { userId: req.user && req.user.id });
    const { fullName, name, dateOfBirth, phone, country, timezone, language, email } = req.body;

    const user = await profileService.updateProfile(req.user.id, {
      fullName,
      name,
      dateOfBirth,
      phone,
      country,
      timezone,
      language,
      email,
    });

    // Normalize language from database format to frontend format
    let normalizedLanguage = user.language;
    if (user.language === 'English') {
      normalizedLanguage = 'en';
    } else if (user.language === 'العربية') {
      normalizedLanguage = 'ar';
    }

    const response = {
      success: true,
      message: 'Profile updated successfully',
      data: {
        profile: {
          fullName: user.fullName,
          dateOfBirth: user.dateOfBirth,
          phone: user.phone,
          country: user.country,
          timezone: user.timezone,
          language: normalizedLanguage,
          email: user.email,
        },
      },
    };
    console.log('[PROFILE] PUT /profile → 200 (updated)', { userId: user.id, response });
    res.status(200).json(response);
  } catch (error) {
    console.error('[PROFILE] PUT /profile → error', error);
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

// Create/Complete profile (for initial setup)
const completeProfile = async (req, res, next) => {
  try {
    console.log('[PROFILE] POST /profile/complete → requested', { userId: req.user && req.user.id });
    const { fullName, dateOfBirth, phone, country, timezone, language } = req.body;

    const user = await profileService.completeProfile(req.user.id, {
      fullName,
      dateOfBirth,
      phone,
      country,
      timezone,
      language,
    });

    // Normalize language from database format to frontend format
    let normalizedLanguage = user.language;
    if (user.language === 'English') {
      normalizedLanguage = 'en';
    } else if (user.language === 'العربية') {
      normalizedLanguage = 'ar';
    }

    const response = {
      success: true,
      message: 'Profile completed successfully',
      data: {
        profile: {
          fullName: user.fullName,
          dateOfBirth: user.dateOfBirth,
          phone: user.phone,
          country: user.country,
          timezone: user.timezone,
          language: normalizedLanguage,
          email: user.email,
        },
      },
    };
    console.log('[PROFILE] POST /profile/complete → 200 (completed)', { userId: user.id, response });
    res.status(200).json(response);
  } catch (error) {
    console.error('[PROFILE] POST /profile/complete → error', error);
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  completeProfile,
};

