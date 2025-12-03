const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth');
const {
  authMiddleware,
  validateSignup,
  validateLogin,
  validateOTP,
  validateResendOTP,
  validateForgotPassword,
  validateResetPassword,
} = require('../../middlewares/auth');
const handleValidationErrors = require('../../middlewares/validation');

// Signup route
router.post('/signup', validateSignup, handleValidationErrors, authController.signup);

// Login route
router.post('/login', validateLogin, handleValidationErrors, authController.login);

// OTP routes
router.post('/verify-otp', validateOTP, handleValidationErrors, authController.verifyOTP);
router.post('/resend-otp', validateResendOTP, handleValidationErrors, authController.resendOTP);

// Password reset routes
router.post('/forgot-password', validateForgotPassword, handleValidationErrors, authController.forgotPassword);
router.post('/reset-password', validateResetPassword, handleValidationErrors, authController.resetPassword);

// User route (protected)
router.get('/me', authMiddleware, authController.getCurrentUser);

// Google OAuth routes
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback);
router.get('/google/url', authController.getGoogleAuthUrl); // Backward compatibility

// LinkedIn OAuth routes
router.get('/linkedin', authController.linkedinAuth);
router.get('/linkedin/callback', authController.linkedinCallback);
router.get('/linkedin/url', authController.getLinkedInAuthUrl); // Backward compatibility

module.exports = router;


