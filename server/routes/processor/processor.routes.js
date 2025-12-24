const express = require('express');
const router = express.Router();
const processorController = require('../../controllers/processor');
const { authMiddleware, processorMiddleware } = require('../../middlewares/auth');

// Get processor dashboard
router.get(
  '/dashboard',
  authMiddleware,
  processorMiddleware,
  processorController.getDashboard
);

module.exports = router;

