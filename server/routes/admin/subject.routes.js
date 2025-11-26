const express = require('express');
const router = express.Router();
const subjectController = require('../../controllers/admin/subject.controller');
const { authMiddleware, superadminMiddleware, adminOrSuperadminMiddleware } = require('../../middlewares/auth');
const { validateCreateSubject, validateUpdateSubject } = require('../../middlewares/admin');

// Routes
// Create, Update, Delete - Only superadmin
router.post(
  '/',
  authMiddleware,
  superadminMiddleware,
  validateCreateSubject,
  subjectController.createSubject
);

// View - Both admin and superadmin
router.get(
  '/',
  authMiddleware,
  adminOrSuperadminMiddleware,
  subjectController.getAllSubjects
);

router.get(
  '/:subjectId',
  authMiddleware,
  adminOrSuperadminMiddleware,
  subjectController.getSubjectById
);

// Update, Delete - Only superadmin
router.put(
  '/:subjectId',
  authMiddleware,
  superadminMiddleware,
  validateUpdateSubject,
  subjectController.updateSubject
);

router.delete(
  '/:subjectId',
  authMiddleware,
  superadminMiddleware,
  subjectController.deleteSubject
);

module.exports = router;

