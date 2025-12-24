const express = require('express');
const router = express.Router();
const topicController = require('../../controllers/admin/topic.controller');
const { authMiddleware } = require('../../middlewares/auth');

// Student-accessible routes (read-only)
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

module.exports = router;
