const Language = require('../../../models/language');

/**
 * Create language
 */
const createLanguage = async (languageData) => {
  // Validate that code is unique
  const existing = await Language.findByCode(languageData.code);
  if (existing) {
    throw new Error('Language code already exists');
  }
  return await Language.create(languageData);
};

/**
 * Get all languages
 */
const getAllLanguages = async (filter = {}) => {
  return await Language.findMany({
    where: filter,
    orderBy: { createdAt: 'desc' }
  });
};

/**
 * Get active languages (for student signup/profile)
 */
const getActiveLanguages = async () => {
  return await Language.findActive();
};

/**
 * Find language by ID
 */
const findLanguageById = async (languageId) => {
  return await Language.findById(languageId);
};

/**
 * Update language
 */
const updateLanguage = async (language, updateData) => {
  const updateDataFiltered = {};
  
  if (updateData.name !== undefined) {
    updateDataFiltered.name = updateData.name;
  }
  if (updateData.code !== undefined) {
    // Check if code is being changed and if it's unique
    if (updateData.code !== language.code) {
      const existing = await Language.findByCode(updateData.code);
      if (existing) {
        throw new Error('Language code already exists');
      }
      updateDataFiltered.code = updateData.code;
    }
  }
  if (updateData.isDefault !== undefined) {
    updateDataFiltered.isDefault = updateData.isDefault;
  }
  if (updateData.status !== undefined) {
    updateDataFiltered.status = updateData.status;
  }
  
  return await Language.update(language.id, updateDataFiltered);
};

/**
 * Delete language
 */
const deleteLanguage = async (languageId) => {
  return await Language.delete(languageId);
};

/**
 * Get languages with pagination
 */
const getLanguagesPaginated = async (page = 1, pageSize = 10, filter = {}) => {
  const skip = (page - 1) * pageSize;
  const [languages, total] = await Promise.all([
    Language.findMany({
      where: filter,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' }
    }),
    Language.count(filter)
  ]);

  return {
    languages,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    }
  };
};

module.exports = {
  createLanguage,
  getAllLanguages,
  getActiveLanguages,
  findLanguageById,
  updateLanguage,
  deleteLanguage,
  getLanguagesPaginated,
};
