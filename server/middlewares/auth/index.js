const authMiddleware = require('./auth.middleware');
const superadminMiddleware = require('./superadmin.middleware');
const {
  validateSignup,
  validateLogin,
  validateOTP,
  validateResendOTP,
  validateForgotPassword,
  validateResetPassword,
} = require('./validation.middleware');

module.exports = {
  authMiddleware,
  superadminMiddleware,
  validateSignup,
  validateLogin,
  validateOTP,
  validateResendOTP,
  validateForgotPassword,
  validateResetPassword,
};
