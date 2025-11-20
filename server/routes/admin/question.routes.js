const express = require('express');
const router = express.Router();
const questionController = require('../../controllers/admin/question.controller');
const { authMiddleware } = require('../../middlewares/auth');
const {
  gathererMiddleware,
  creatorMiddleware,
  explainerMiddleware,
  processorMiddleware,
  workflowRoleMiddleware,
} = require('../../middlewares/auth/role.middleware');

// Get topics by subject (accessible by all workflow roles)
// This must be before /:questionId route to avoid conflicts
router.get(
  '/topics/:subjectId',
  authMiddleware,
  workflowRoleMiddleware,
  questionController.getTopicsBySubject
);

// Gatherer routes
router.post(
  '/',
  authMiddleware,
  gathererMiddleware,
  questionController.createQuestion
);

router.get(
  '/',
  authMiddleware,
  gathererMiddleware,
  questionController.getQuestions
);

router.get(
  '/:questionId',
  authMiddleware,
  gathererMiddleware,
  questionController.getQuestionById
);

// Creator routes
router.get(
  '/creator',
  authMiddleware,
  creatorMiddleware,
  questionController.getQuestions
);

router.get(
  '/creator/:questionId',
  authMiddleware,
  creatorMiddleware,
  questionController.getQuestionById
);

router.put(
  '/creator/:questionId',
  authMiddleware,
  creatorMiddleware,
  questionController.updateQuestion
);

// Explainer routes
router.get(
  '/explainer',
  authMiddleware,
  explainerMiddleware,
  questionController.getQuestions
);

router.get(
  '/explainer/:questionId',
  authMiddleware,
  explainerMiddleware,
  questionController.getQuestionById
);

router.put(
  '/explainer/:questionId/explanation',
  authMiddleware,
  explainerMiddleware,
  questionController.updateExplanation
);

// Processor routes
router.get(
  '/processor',
  authMiddleware,
  processorMiddleware,
  questionController.getQuestions
);

router.get(
  '/processor/:questionId',
  authMiddleware,
  processorMiddleware,
  questionController.getQuestionById
);

router.post(
  '/processor/:questionId/approve',
  authMiddleware,
  processorMiddleware,
  questionController.approveQuestion
);

router.post(
  '/processor/:questionId/reject',
  authMiddleware,
  processorMiddleware,
  questionController.rejectQuestion
);

module.exports = router;

