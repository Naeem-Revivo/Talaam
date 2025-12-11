const express = require('express');
const router = express.Router();
const explainerController = require('../../controllers/explainer');
const { authMiddleware, explainerMiddleware } = require('../../middlewares/auth');

// Get explainer dashboard
router.get(
  '/dashboard',
  authMiddleware,
  explainerMiddleware,
  explainerController.getDashboard
);

module.exports = router;

