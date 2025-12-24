const express = require('express');
const router = express.Router();
const languageController = require('../../controllers/admin/language.controller');
const { authMiddleware, superadminMiddleware } = require('../../middlewares/auth');

// Routes
// Create - Only superadmin
router.post(
  '/',
  authMiddleware,
  superadminMiddleware,
  languageController.createLanguage
);

// View - All admin roles
router.get(
  '/',
  authMiddleware,
  languageController.getAllLanguages
);

router.get(
  '/:languageId',
  authMiddleware,
  languageController.getLanguageById
);

// Update - Only superadmin
router.put(
  '/:languageId',
  authMiddleware,
  superadminMiddleware,
  languageController.updateLanguage
);

// Delete - Only superadmin
router.delete(
  '/:languageId',
  authMiddleware,
  superadminMiddleware,
  languageController.deleteLanguage
);

module.exports = router;
