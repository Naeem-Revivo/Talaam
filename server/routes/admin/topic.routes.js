const express = require('express');
const router = express.Router();
const topicController = require('../../controllers/admin/topic.controller');
const { authMiddleware, superadminMiddleware } = require('../../middlewares/auth');
const { validateCreateTopic, validateUpdateTopic } = require('../../middlewares/admin');

// Routes
// Create, Update, Delete - Only superadmin
router.post(
  '/',
  authMiddleware,
  superadminMiddleware,
  validateCreateTopic,
  topicController.createTopic
);

// View - All admin roles and students
router.get(
  '/',
  authMiddleware,
  topicController.getAllTopics
);

router.get(
  '/:topicId',
  authMiddleware,
  topicController.getTopicById
);

// Update, Delete - Only superadmin
router.put(
  '/:topicId',
  authMiddleware,
  superadminMiddleware,
  validateUpdateTopic,
  topicController.updateTopic
);

router.delete(
  '/:topicId',
  authMiddleware,
  superadminMiddleware,
  topicController.deleteTopic
);

module.exports = router;

