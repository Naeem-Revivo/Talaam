const userService = require('./user.service');
const signupService = require('./signup.service');
const loginService = require('./login.service');
const passwordService = require('./password.service');
const otpService = require('./otp.service');
const googleAuthService = require('./googleAuth.service');

module.exports = {
  ...userService,
  ...signupService,
  ...loginService,
  ...passwordService,
  ...otpService,
  ...googleAuthService,
};

