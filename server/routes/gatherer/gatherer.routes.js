const express = require('express');
const router = express.Router();
const gathererController = require('../../controllers/gatherer');
const { authMiddleware, gathererMiddleware } = require('../../middlewares/auth');

// Get gatherer dashboard
router.get(
  '/dashboard',
  authMiddleware,
  gathererMiddleware,
  gathererController.getDashboard
);

module.exports = router;

