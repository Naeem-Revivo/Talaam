const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const handleValidationErrors = require('../middlewares/validation.middleware');

// Validation middleware
const validateSignup = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

const validateOTP = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('otp')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('OTP must be a 6-digit number'),
];

const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const validateResendOTP = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
];

const validateForgotPassword = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
];

const validateResetPassword = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

// Routes
router.post('/signup', validateSignup, handleValidationErrors, authController.signup);
router.post('/verify-otp', validateOTP, handleValidationErrors, authController.verifyOTP);
router.post('/resend-otp', validateResendOTP, handleValidationErrors, authController.resendOTP);
router.post('/login', validateLogin, handleValidationErrors, authController.login);
router.post('/forgot-password', validateForgotPassword, handleValidationErrors, authController.forgotPassword);
router.post('/reset-password', validateResetPassword, handleValidationErrors, authController.resetPassword);
router.get('/me', authMiddleware, authController.getCurrentUser);
// Google OAuth
router.get('/google/url', authController.getGoogleAuthUrl);
router.get('/google/callback', authController.googleCallback);

module.exports = router;
