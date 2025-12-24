const express = require('express');
const router = express.Router();
const subjectController = require('../../controllers/admin/subject.controller');
const { authMiddleware } = require('../../middlewares/auth');

// Student-accessible routes (read-only)
router.get(
  '/',
  authMiddleware,
  subjectController.getAllSubjects
);

router.get(
  '/:subjectId',
  authMiddleware,
  subjectController.getSubjectById
);

module.exports = router;
