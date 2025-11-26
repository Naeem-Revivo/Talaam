const authMiddleware = require('./auth.middleware');
const superadminMiddleware = require('./superadmin.middleware');
const adminMiddleware = require('./admin.middleware');
const adminOrSuperadminMiddleware = require('./adminOrSuperadmin.middleware');
const studentMiddleware = require('./student.middleware');
const {
  validateSignup,
  validateLogin,
  validateOTP,
  validateResendOTP,
  validateForgotPassword,
  validateResetPassword,
} = require('./validation.middleware');
const {
  gathererMiddleware,
  creatorMiddleware,
  explainerMiddleware,
  processorMiddleware,
  workflowRoleMiddleware,
} = require('./role.middleware');

module.exports = {
  authMiddleware,
  superadminMiddleware,
  adminMiddleware,
  adminOrSuperadminMiddleware,
  studentMiddleware,
  validateSignup,
  validateLogin,
  validateOTP,
  validateResendOTP,
  validateForgotPassword,
  validateResetPassword,
  gathererMiddleware,
  creatorMiddleware,
  explainerMiddleware,
  processorMiddleware,
  workflowRoleMiddleware,
};
