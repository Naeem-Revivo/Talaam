const express = require('express');
const router = express.Router();
const classificationController = require('../../controllers/admin/classification');
const { authMiddleware } = require('../../middlewares/auth');

// Get classification data (exams, subjects, topics)
// Query param: subjectId (optional) - if provided, returns only topics for that subject
// Accessible by all authenticated users (admin roles and students)
router.get(
  '/',
  authMiddleware,
  classificationController.getClassification
);

// Get all exams for filter dropdowns
router.get(
  '/exams',
  authMiddleware,
  classificationController.getExams
);

// Get all subjects for filter dropdowns
router.get(
  '/subjects',
  authMiddleware,
  classificationController.getSubjects
);

// Get topics by subject ID for filter dropdowns
// Query param: subjectId (required)
router.get(
  '/topics',
  authMiddleware,
  classificationController.getTopics
);

module.exports = router;

