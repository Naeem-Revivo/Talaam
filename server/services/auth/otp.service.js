const { generateToken } = require('../../config/jwt');
const { sendOTPEmail } = require('../../config/nodemailer');
const { findUserByEmail } = require('./user.service');

/**
 * Generate a 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Get OTP expiry time (10 minutes from now)
 */
const getOTPExpiry = () => {
  return new Date(Date.now() + 10 * 60 * 1000);
};

/**
 * Verify OTP
 */
const verifyOTP = async (email, otp) => {
  // Find user
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }

  // Check if email is already verified
  if (user.isEmailVerified) {
    throw new Error('Email is already verified');
  }

  // Check if OTP exists
  if (!user.otp) {
    throw new Error('OTP not found. Please request a new OTP');
  }

  // Check if OTP is expired
  if (new Date() > user.otpExpiry) {
    throw new Error('OTP has expired. Please request a new OTP');
  }

  // Verify OTP
  if (user.otp !== otp) {
    throw new Error('Invalid OTP');
  }

  // Check if user is suspended
  if (user.status === 'suspended') {
    throw new Error('Your account has been suspended. Please contact administrator.');
  }

  // Update user
  user.isEmailVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  // Generate token
  const token = generateToken(user._id);

  return {
    user,
    token,
  };
};

/**
 * Resend OTP
 */
const resendOTP = async (email) => {
  // Find user
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }

  // Check if email is already verified
  if (user.isEmailVerified) {
    throw new Error('Email is already verified');
  }

  // Generate new OTP
  const otp = generateOTP();
  const otpExpiry = getOTPExpiry();

  // Update user
  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();

  // Send OTP email
  await sendOTPEmail(email, user.name || email, otp);

  return { success: true };
};

module.exports = {
  generateOTP,
  getOTPExpiry,
  verifyOTP,
  resendOTP,
};

