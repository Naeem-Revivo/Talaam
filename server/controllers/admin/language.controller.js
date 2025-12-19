const languageService = require('../../services/admin/language');

/**
 * Create language
 * Only superadmin can create languages
 */
const createLanguage = async (req, res, next) => {
  try {
    const { name, code, isDefault, status } = req.body;

    console.log('[LANGUAGE] POST /admin/languages → requested', {
      name,
      code,
      isDefault,
      status,
      requestedBy: req.user.id,
      requesterRole: req.user.role,
    });

    // Ensure only superadmin can create languages
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can create languages',
      });
    }

    // Validate required fields
    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: 'Name and code are required',
      });
    }

    // Create language
    const languageData = {
      name: name.trim(),
      code: code.trim().toUpperCase(),
      isDefault: isDefault === true || isDefault === 'true',
      status: status ? status.trim().toLowerCase() : 'active',
    };

    const language = await languageService.createLanguage(languageData);

    const response = {
      success: true,
      message: 'Language created successfully',
      data: {
        language: {
          id: language.id,
          name: language.name,
          code: language.code,
          isDefault: language.isDefault,
          status: language.status,
          createdAt: language.createdAt,
          updatedAt: language.updatedAt,
        },
      },
    };

    console.log('[LANGUAGE] POST /admin/languages → 201 (created)', { languageId: language.id });
    res.status(201).json(response);
  } catch (error) {
    console.error('[LANGUAGE] POST /admin/languages → error', error);
    if (error.message === 'Language code already exists') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: [
          {
            field: 'code',
            message: 'Language code already exists. Please choose a different code.',
          },
        ],
      });
    }
    if (error.code === 'P2002' && error.meta?.target?.includes('code')) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: [
          {
            field: 'code',
            message: 'Language code already exists. Please choose a different code.',
          },
        ],
      });
    }
    next(error);
  }
};

/**
 * Get all languages
 * All admin roles can access this
 */
const getAllLanguages = async (req, res, next) => {
  try {
    const { page, pageSize, status } = req.query;

    console.log('[LANGUAGE] GET /admin/languages → requested', { 
      requestedBy: req.user.id,
      page,
      pageSize,
      status
    });

    const filter = {};
    if (status) {
      filter.status = status.toLowerCase();
    }

    let languages;
    let pagination;

    if (page && pageSize) {
      const result = await languageService.getLanguagesPaginated(
        parseInt(page),
        parseInt(pageSize),
        filter
      );
      languages = result.languages;
      pagination = result.pagination;
    } else {
      languages = await languageService.getAllLanguages(filter);
    }

    const response = {
      success: true,
      data: {
        languages: languages.map((language) => ({
          id: language.id,
          name: language.name,
          code: language.code,
          isDefault: language.isDefault,
          status: language.status,
          createdAt: language.createdAt,
          updatedAt: language.updatedAt,
        })),
      },
    };

    if (pagination) {
      response.data.pagination = pagination;
    }

    console.log('[LANGUAGE] GET /admin/languages → 200 (ok)', { count: languages.length });
    res.status(200).json(response);
  } catch (error) {
    console.error('[LANGUAGE] GET /admin/languages → error', error);
    next(error);
  }
};

/**
 * Get active languages (for student signup/profile)
 * Public endpoint - no authentication required
 */
const getActiveLanguages = async (req, res, next) => {
  try {
    console.log('[LANGUAGE] GET /api/languages/active → requested');

    const languages = await languageService.getActiveLanguages();

    const response = {
      success: true,
      data: {
        languages: languages.map((language) => ({
          id: language.id,
          name: language.name,
          code: language.code,
          isDefault: language.isDefault,
        })),
      },
    };

    console.log('[LANGUAGE] GET /api/languages/active → 200 (ok)', { count: languages.length });
    res.status(200).json(response);
  } catch (error) {
    console.error('[LANGUAGE] GET /api/languages/active → error', error);
    next(error);
  }
};

/**
 * Get single language by ID
 */
const getLanguageById = async (req, res, next) => {
  try {
    const { languageId } = req.params;

    console.log('[LANGUAGE] GET /admin/languages/:languageId → requested', {
      languageId,
      requestedBy: req.user.id,
    });

    const language = await languageService.findLanguageById(languageId);

    if (!language) {
      return res.status(404).json({
        success: false,
        message: 'Language not found',
      });
    }

    const response = {
      success: true,
      data: {
        language: {
          id: language.id,
          name: language.name,
          code: language.code,
          isDefault: language.isDefault,
          status: language.status,
          createdAt: language.createdAt,
          updatedAt: language.updatedAt,
        },
      },
    };

    console.log('[LANGUAGE] GET /admin/languages/:languageId → 200 (ok)', { languageId: language.id });
    res.status(200).json(response);
  } catch (error) {
    console.error('[LANGUAGE] GET /admin/languages/:languageId → error', error);
    next(error);
  }
};

/**
 * Update language
 * Only superadmin can update languages
 */
const updateLanguage = async (req, res, next) => {
  try {
    const { languageId } = req.params;
    const { name, code, isDefault, status } = req.body;

    console.log('[LANGUAGE] PUT /admin/languages/:languageId → requested', {
      languageId,
      requestedBy: req.user.id,
      requesterRole: req.user.role,
    });

    // Ensure only superadmin can update languages
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can update languages',
      });
    }

    const language = await languageService.findLanguageById(languageId);

    if (!language) {
      return res.status(404).json({
        success: false,
        message: 'Language not found',
      });
    }

    // Update language
    const updateData = {};
    if (name !== undefined) {
      updateData.name = name.trim();
    }
    if (code !== undefined) {
      updateData.code = code.trim().toUpperCase();
    }
    if (isDefault !== undefined) {
      updateData.isDefault = isDefault === true || isDefault === 'true';
    }
    if (status !== undefined) {
      updateData.status = status.trim().toLowerCase();
    }

    const updatedLanguage = await languageService.updateLanguage(language, updateData);

    const response = {
      success: true,
      message: 'Language updated successfully',
      data: {
        language: {
          id: updatedLanguage.id,
          name: updatedLanguage.name,
          code: updatedLanguage.code,
          isDefault: updatedLanguage.isDefault,
          status: updatedLanguage.status,
          createdAt: updatedLanguage.createdAt,
          updatedAt: updatedLanguage.updatedAt,
        },
      },
    };

    console.log('[LANGUAGE] PUT /admin/languages/:languageId → 200 (updated)', { languageId: updatedLanguage.id });
    res.status(200).json(response);
  } catch (error) {
    console.error('[LANGUAGE] PUT /admin/languages/:languageId → error', error);
    if (error.message === 'Language code already exists') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: [
          {
            field: 'code',
            message: 'Language code already exists. Please choose a different code.',
          },
        ],
      });
    }
    if (error.code === 'P2002' && error.meta?.target?.includes('code')) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: [
          {
            field: 'code',
            message: 'Language code already exists. Please choose a different code.',
          },
        ],
      });
    }
    next(error);
  }
};

/**
 * Delete language
 * Only superadmin can delete languages
 */
const deleteLanguage = async (req, res, next) => {
  try {
    const { languageId } = req.params;

    console.log('[LANGUAGE] DELETE /admin/languages/:languageId → requested', {
      languageId,
      requestedBy: req.user.id,
      requesterRole: req.user.role,
    });

    // Ensure only superadmin can delete languages
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can delete languages',
      });
    }

    const language = await languageService.findLanguageById(languageId);

    if (!language) {
      return res.status(404).json({
        success: false,
        message: 'Language not found',
      });
    }

    await languageService.deleteLanguage(languageId);

    const response = {
      success: true,
      message: 'Language deleted successfully',
      data: {
        language: {
          id: language.id,
          name: language.name,
        },
      },
    };

    console.log('[LANGUAGE] DELETE /admin/languages/:languageId → 200 (deleted)', { languageId: language.id });
    res.status(200).json(response);
  } catch (error) {
    console.error('[LANGUAGE] DELETE /admin/languages/:languageId → error', error);
    next(error);
  }
};

module.exports = {
  createLanguage,
  getAllLanguages,
  getActiveLanguages,
  getLanguageById,
  updateLanguage,
  deleteLanguage,
};
