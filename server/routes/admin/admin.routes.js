const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin');
const { authMiddleware, superadminMiddleware } = require('../../middlewares/auth');
const {
  validateCreateAdmin,
  validateUpdateStatus,
  validateUpdateAdmin,
} = require('../../middlewares/admin');

// Routes (all require superadmin access)
router.get('/dashboard/statistics', authMiddleware, superadminMiddleware, adminController.getDashboardStatistics);
router.get('/users/management', authMiddleware, superadminMiddleware, adminController.getUserManagementStatistics);
// Allow all admin roles to get users (for processor selection, etc.)
router.get('/users', authMiddleware, adminController.getAllAdmins);

// Student Management Routes (all require superadmin access)
router.get('/students/management', authMiddleware, superadminMiddleware, adminController.getStudentManagementStatistics);
router.get('/students', authMiddleware, superadminMiddleware, adminController.getAllStudents);
router.get('/students/:id', authMiddleware, superadminMiddleware, adminController.getStudentById);
router.put('/students/:id/status', authMiddleware, superadminMiddleware, adminController.updateStudentStatus);
router.post(
  '/create',
  authMiddleware,
  superadminMiddleware,
  validateCreateAdmin,
  adminController.createAdmin
);
router.put(
  '/status/:userId',
  authMiddleware,
  superadminMiddleware,
  validateUpdateStatus,
  adminController.updateUserStatus
);

router.put(
  '/:userId',
  authMiddleware,
  superadminMiddleware,
  validateUpdateAdmin,
  adminController.updateAdmin
);

router.delete(
  '/:userId',
  authMiddleware,
  superadminMiddleware,
  adminController.deleteAdmin
);

// Import exam routes
const examRoutes = require('./exam.routes');

// Use exam routes
router.use('/exams', examRoutes);

// Import subject routes
const subjectRoutes = require('./subject.routes');

// Use subject routes
router.use('/subjects', subjectRoutes);

// Import topic routes
const topicRoutes = require('./topic.routes');

// Use topic routes
router.use('/topics', topicRoutes);

// Import question routes
const questionRoutes = require('./question.routes');

// Use question routes
router.use('/questions', questionRoutes);

// Classification Management Routes (all require superadmin access)
// These must be defined BEFORE the classification routes to avoid conflicts
router.get('/classification/statistics', authMiddleware, superadminMiddleware, adminController.getClassificationStatistics);
router.get('/classification/subjects', authMiddleware, superadminMiddleware, adminController.getSubjectsPaginated);
router.get('/classification/topics', authMiddleware, superadminMiddleware, adminController.getTopicsPaginated);
router.get('/classification/subjects/:subjectId/topics', authMiddleware, superadminMiddleware, adminController.getTopicsBySubject);
router.post('/classification/subjects', authMiddleware, superadminMiddleware, adminController.createSubject);
router.put('/classification/subjects/:subjectId', authMiddleware, superadminMiddleware, adminController.updateSubject);
router.delete('/classification/subjects/:subjectId', authMiddleware, superadminMiddleware, adminController.deleteSubject);
router.post('/classification/subjects/:subjectId/topics', authMiddleware, superadminMiddleware, adminController.createTopic);
router.put('/classification/topics/:topicId', authMiddleware, superadminMiddleware, adminController.updateTopic);
router.delete('/classification/topics/:topicId', authMiddleware, superadminMiddleware, adminController.deleteTopic);

// Import classification routes
const classificationRoutes = require('./classification.routes');

// Use classification routes (these are for general classification data, not management)
router.use('/classification', classificationRoutes);

// Import plan routes
const planRoutes = require('./plan.routes');

// Use plan routes
router.use('/plans', planRoutes);

// Subscription Management Routes (all require superadmin access)
router.get('/subscriptions', authMiddleware, superadminMiddleware, adminController.getAllUserSubscriptions);
router.get('/subscriptions/:subscriptionId', authMiddleware, superadminMiddleware, adminController.getSubscriptionDetails);
router.post('/subscriptions/:subscriptionId/sync-payment', authMiddleware, superadminMiddleware, adminController.syncSubscriptionPayment);
router.get('/payments/history', authMiddleware, superadminMiddleware, adminController.getPaymentHistory);

// Analytics & Reports Routes (all require superadmin access)
// User Analytics
router.get('/analytics/user/hero', authMiddleware, superadminMiddleware, adminController.getUserAnalyticsHero);
router.get('/analytics/user/growth', authMiddleware, superadminMiddleware, adminController.getUserGrowthChart);
router.get('/analytics/user/performance', authMiddleware, superadminMiddleware, adminController.getTopPerformanceUsers);

// Subscription Analytics
router.get('/analytics/subscription/trend', authMiddleware, superadminMiddleware, adminController.getSubscriptionTrendMetrics);
router.get('/analytics/subscription/revenue-trend', authMiddleware, superadminMiddleware, adminController.getRevenueTrendChart);
router.get('/analytics/subscription/plan-breakdown', authMiddleware, superadminMiddleware, adminController.getPlanWiseBreakdown);
router.get('/analytics/subscription/plan-distribution', authMiddleware, superadminMiddleware, adminController.getPlanDistribution);

// Practice Analytics
router.get('/analytics/practice-distribution', authMiddleware, superadminMiddleware, adminController.getPracticeDistribution);

// Content Moderation Routes (all require superadmin access)
const questionController = require('../../controllers/admin/question.controller');
router.get('/moderation/flagged', authMiddleware, superadminMiddleware, questionController.getFlaggedQuestionsForModeration);
router.post('/moderation/:questionId/approve', authMiddleware, superadminMiddleware, questionController.approveStudentFlag);
router.post('/moderation/:questionId/reject', authMiddleware, superadminMiddleware, questionController.rejectStudentFlag);

module.exports = router;

