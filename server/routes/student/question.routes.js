const express = require('express');
const router = express.Router();
const questionController = require('../../controllers/student/question.controller');
const { authMiddleware, studentMiddleware } = require('../../middlewares/auth');

// All routes require authentication and student role
router.use(authMiddleware);
router.use(studentMiddleware);

// Get available questions (filtered by exam, subject, topic)
router.get('/', questionController.getAvailableQuestions);

// Study Mode: Submit answer and get immediate feedback
router.post('/study', questionController.submitStudyAnswer);

// Study Mode: Get study history
router.get('/study/history', questionController.getStudyHistory);

// Test Mode: Start a test (get questions)
router.get('/test/start', questionController.startTest);

// Test Mode: Submit test answers and get results
router.post('/test/submit', questionController.submitTestAnswers);

// Test Mode: Get test history
router.get('/test/history', questionController.getTestHistory);

// Test Mode: Get detailed test result by ID
router.get('/test/:testId', questionController.getTestResultById);

// Get question by ID (must be last to avoid conflicts with specific routes)
router.get('/:questionId', questionController.getQuestionById);

module.exports = router;

