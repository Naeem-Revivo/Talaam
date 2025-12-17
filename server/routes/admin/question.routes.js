const express = require('express');
const router = express.Router();
const questionController = require('../../controllers/admin/question.controller');
const { authMiddleware, superadminMiddleware, adminOrSuperadminMiddleware } = require('../../middlewares/auth');
const {
  gathererMiddleware,
  creatorMiddleware,
  explainerMiddleware,
  processorMiddleware,
  workflowRoleMiddleware,
} = require('../../middlewares/auth/role.middleware');

// Get topics by subject (accessible by all workflow roles and superadmin)
// This must be before /:questionId route to avoid conflicts
router.get(
  '/topics/:subjectId',
  authMiddleware,
  adminOrSuperadminMiddleware,
  questionController.getTopicsBySubject
);

// Superadmin routes
router.get(
  '/all',
  authMiddleware,
  superadminMiddleware,
  questionController.getAllQuestionsForSuperadmin
);

router.get(
  '/all/:questionId',
  authMiddleware,
  superadminMiddleware,
  questionController.getQuestionDetailForSuperadmin
);

router.post(
  '/all/:questionId/comment',
  authMiddleware,
  superadminMiddleware,
  questionController.addCommentToQuestion
);

// Approved questions route (for superadmin dashboard)
router.get(
  '/approved',
  authMiddleware,
  superadminMiddleware,
  questionController.getApprovedQuestions
);

// Toggle question visibility
router.put(
  '/:questionId/visibility',
  authMiddleware,
  superadminMiddleware,
  questionController.toggleQuestionVisibility
);

// Gatherer routes
router.get(
  '/gatherer/stats',
  authMiddleware,
  gathererMiddleware,
  questionController.getGathererStats
);

router.get(
  '/gatherer/list',
  authMiddleware,
  gathererMiddleware,
  questionController.getGathererQuestions
);

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

router.put(
  '/gatherer/:questionId',
  authMiddleware,
  gathererMiddleware,
  questionController.updateFlaggedQuestionByGatherer
);

router.post(
  '/gatherer/:questionId/reject-flag',
  authMiddleware,
  gathererMiddleware,
  questionController.rejectFlagByGatherer
);

// Creator routes (must be before /:questionId to avoid route conflicts)
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

router.post(
  '/creator/:questionId/flag',
  authMiddleware,
  creatorMiddleware,
  questionController.flagQuestionByCreator
);

router.post(
  '/creator/:questionId/variant',
  authMiddleware,
  creatorMiddleware,
  questionController.createQuestionVariant
);

router.put(
  '/creator/:questionId/update-flagged-variant',
  authMiddleware,
  creatorMiddleware,
  questionController.updateFlaggedVariantByCreator
);

router.post(
  '/creator/:questionId/reject-flag',
  authMiddleware,
  creatorMiddleware,
  questionController.rejectFlagByCreator
);

// Explainer routes (must be before /:questionId to avoid route conflicts)
router.get(
  '/explainer',
  authMiddleware,
  explainerMiddleware,
  questionController.getQuestions
);

router.get(
  '/explainer/completed-explanations',
  authMiddleware,
  explainerMiddleware,
  questionController.getCompletedExplanations
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

router.put(
  '/explainer/:questionId/explanation/draft',
  authMiddleware,
  explainerMiddleware,
  questionController.saveDraftExplanation
);

router.post(
  '/explainer/:questionId/flag',
  authMiddleware,
  explainerMiddleware,
  questionController.flagQuestionByExplainer
);

// Processor routes (must be before /:questionId to avoid route conflicts)
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

// Specific routes must come before the general POST route
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

router.post(
  '/processor/:questionId/flag/review',
  authMiddleware,
  processorMiddleware,
  questionController.reviewCreatorFlag
);

router.post(
  '/processor/:questionId/variant-flag/review',
  authMiddleware,
  processorMiddleware,
  questionController.reviewExplainerFlag
);

router.post(
  '/processor/:questionId/student-flag/review',
  authMiddleware,
  processorMiddleware,
  questionController.reviewStudentFlag
);

router.post(
  '/processor/:questionId/reject-gatherer-flag-rejection',
  authMiddleware,
  processorMiddleware,
  questionController.rejectGathererFlagRejection
);

// General POST route for processor (handles both approve and reject via body status)
router.post(
  '/processor/:questionId',
  authMiddleware,
  processorMiddleware,
  questionController.approveQuestion
);

// Gatherer route for getting question by ID (must be last to avoid conflicts with specific routes)
router.get(
  '/:questionId',
  authMiddleware,
  gathererMiddleware,
  questionController.getQuestionById
);

module.exports = router;

