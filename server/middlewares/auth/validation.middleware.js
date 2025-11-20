const { body } = require('express-validator');

// Validation middleware for signup
const validateSignup = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['student', 'admin'])
    .withMessage('Role must be either student or admin'),
];

// Validation middleware for login
const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

// Validation middleware for OTP verification
const validateOTP = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('otp')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('OTP must be a 6-digit number'),
];

// Validation middleware for resend OTP
const validateResendOTP = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
];

// Validation middleware for forgot password
const validateForgotPassword = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
];

// Validation middleware for reset password
const validateResetPassword = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

module.exports = {
  validateSignup,
  validateLogin,
  validateOTP,
  validateResendOTP,
  validateForgotPassword,
  validateResetPassword,
};

