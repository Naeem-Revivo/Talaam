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

// Study Mode: Save complete session results
router.post('/study/session', questionController.saveStudySessionResults);

// Study Mode: Get study history
router.get('/study/history', questionController.getStudyHistory);

// Sessions list and detail
router.get('/sessions', questionController.getSessionHistory);
router.get('/sessions/:sessionId/incorrect', questionController.getSessionIncorrect);
router.get('/sessions/:sessionId', questionController.getSessionDetail);

// Test Mode: Start a test (get questions)
router.get('/test/start', questionController.startTest);

// Test Mode: Submit test answers and get results
router.post('/test/submit', questionController.submitTestAnswers);

// Test Mode: Get test history
router.get('/test/history', questionController.getTestHistory);

// Test Mode: Get overall summary
router.get('/test/summary', questionController.getTestSummary);

// Test Mode: Get day-wise accuracy trend
router.get('/test/accuracy-trend', questionController.getTestModeAccuracyTrend);

// Dashboard: Get performance data (last 10 sessions)
router.get('/performance', questionController.getPerformanceData);

// Plan: Get subjects, topics, and questions for an exam/plan
router.get('/plan/structure', questionController.getPlanStructure);

// Test Mode: Get detailed test result by ID
router.get('/test/:testId', questionController.getTestResultById);

// Flag question by student
router.post('/:questionId/flag', questionController.flagQuestion);

// Get student's flagged questions
router.get('/flagged', questionController.getStudentFlaggedQuestions);

// Get question by ID (must be last to avoid conflicts with specific routes)
router.get('/:questionId', questionController.getQuestionById);

module.exports = router;

