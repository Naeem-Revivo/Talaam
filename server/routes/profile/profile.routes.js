const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/profile');
const { authMiddleware } = require('../../middlewares/auth');
const { validateProfile } = require('../../middlewares/profile');
const handleValidationErrors = require('../../middlewares/validation');

// Routes
router.get('/profile', authMiddleware, profileController.getProfile);
router.put('/profile', authMiddleware, validateProfile, handleValidationErrors, profileController.updateProfile);
router.post('/profile/complete', authMiddleware, validateProfile, handleValidationErrors, profileController.completeProfile);

module.exports = router;

