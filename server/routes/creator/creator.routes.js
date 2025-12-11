const express = require('express');
const router = express.Router();
const creatorController = require('../../controllers/creator');
const { authMiddleware, creatorMiddleware } = require('../../middlewares/auth');

// Get creator dashboard
router.get(
  '/dashboard',
  authMiddleware,
  creatorMiddleware,
  creatorController.getDashboard
);

module.exports = router;

