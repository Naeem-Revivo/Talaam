const User = require('../../models/user');
const crypto = require('crypto');
const { findUserByEmail } = require('./user.service');
const { sendPasswordResetEmail, sendOTPEmail } = require('../../config/nodemailer');

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
 * Request password reset - sends reset link/token to email (for forgot password page)
 */
const forgotPassword = async (email) => {
  const user = await findUserByEmail(email);
  if (!user) {
    // Don't reveal if user exists or not
    return { success: true, user: null };
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

  await User.update(user.id, {
    resetPasswordToken: resetTokenHash,
    resetPasswordExpiry: resetTokenExpiry,
  });

  try {
    await sendPasswordResetEmail(email, user.name || user.fullName || email, resetToken);
    return { success: true, user, resetToken };
  } catch (emailError) {
    // Rollback token on email failure
    await User.update(user.id, {
      resetPasswordToken: null,
      resetPasswordExpiry: null,
    });
    throw new Error('Failed to send reset email');
  }
};

/**
 * Request password reset OTP - sends OTP to email (for profile page)
 */
const forgotPasswordOTP = async (email) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }

  // Generate OTP
  const otp = generateOTP();
  const otpExpiry = getOTPExpiry();

  // Store OTP in user record (using otp and otpExpiry fields)
  await User.update(user.id, {
    otp,
    otpExpiry,
  });

  try {
    // Send OTP email
    await sendOTPEmail(email, user.name || user.fullName || email, otp);
    return { success: true, user };
  } catch (emailError) {
    // Rollback OTP on email failure
    await User.update(user.id, {
      otp: null,
      otpExpiry: null,
    });
    throw new Error('Failed to send OTP email');
  }
};

/**
 * Reset password using token (for forgot password page)
 */
const resetPassword = async (token, password) => {
  const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const { prisma } = require('../../config/db/prisma');

  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: resetTokenHash,
      resetPasswordExpiry: { gt: new Date() },
    },
  });

  if (!user) {
    throw new Error('Invalid or expired token');
  }

  await User.update(user.id, {
    password: password,
    resetPasswordToken: null,
    resetPasswordExpiry: null,
  });

  return { success: true };
};

/**
 * Reset password using OTP (for profile page)
 */
const resetPasswordOTP = async (email, otp, password) => {
  const user = await findUserByEmail(email);
  
  if (!user) {
    throw new Error('User not found');
  }

  // Check if OTP exists
  if (!user.otp) {
    throw new Error('OTP not found. Please request a new OTP');
  }

  // Check if OTP is expired
  if (!user.otpExpiry || new Date() > user.otpExpiry) {
    throw new Error('OTP has expired. Please request a new OTP');
  }

  // Verify OTP
  if (user.otp !== otp) {
    throw new Error('Invalid OTP');
  }

  // Update password and clear OTP
  await User.update(user.id, {
    password: password,
    otp: null,
    otpExpiry: null,
  });

  return { success: true };
};

module.exports = {
  forgotPassword,
  forgotPasswordOTP,
  resetPassword,
  resetPasswordOTP,
};

