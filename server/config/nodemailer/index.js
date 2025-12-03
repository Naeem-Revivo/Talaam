const transporter = require('./transporter');
const { sendOTPEmail, sendPasswordResetEmail, sendTaalamAccountEmail } = require('./emailTemplates');

module.exports = {
  transporter,
  sendOTPEmail,
  sendPasswordResetEmail,
  sendTaalamAccountEmail,
};

