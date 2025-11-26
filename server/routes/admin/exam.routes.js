const express = require('express');
const router = express.Router();
const examController = require('../../controllers/admin/exam.controller');
const { authMiddleware, superadminMiddleware, adminOrSuperadminMiddleware } = require('../../middlewares/auth');
const { validateCreateExam, validateUpdateExam } = require('../../middlewares/admin');

// Routes
// Create, Update, Delete - Only superadmin
router.post(
  '/',
  authMiddleware,
  superadminMiddleware,
  validateCreateExam,
  examController.createExam
);

// View - Both admin and superadmin
router.get(
  '/',
  authMiddleware,
  adminOrSuperadminMiddleware,
  examController.getAllExams
);

router.get(
  '/:examId',
  authMiddleware,
  adminOrSuperadminMiddleware,
  examController.getExamById
);

// Update, Delete - Only superadmin
router.put(
  '/:examId',
  authMiddleware,
  superadminMiddleware,
  validateUpdateExam,
  examController.updateExam
);

router.delete(
  '/:examId',
  authMiddleware,
  superadminMiddleware,
  examController.deleteExam
);

module.exports = router;

