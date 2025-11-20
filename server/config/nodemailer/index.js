const transporter = require('./transporter');
const { sendOTPEmail, sendPasswordResetEmail } = require('./emailTemplates');

module.exports = {
  transporter,
  sendOTPEmail,
  sendPasswordResetEmail,
};

