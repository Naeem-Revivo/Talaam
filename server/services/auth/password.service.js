const User = require('../../models/user');
const crypto = require('crypto');
const { findUserByEmail } = require('./user.service');
const { sendPasswordResetEmail } = require('../../config/nodemailer');

/**
 * Request password reset
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

  user.resetPasswordToken = resetTokenHash;
  user.resetPasswordExpiry = resetTokenExpiry;
  await user.save({ validateBeforeSave: false });

  try {
    await sendPasswordResetEmail(email, user.name || email, resetToken);
    return { success: true, user, resetToken };
  } catch (emailError) {
    // Rollback token on email failure
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    throw new Error('Failed to send reset email');
  }
};

/**
 * Reset password using token
 */
const resetPassword = async (token, password) => {
  const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: resetTokenHash,
    resetPasswordExpiry: { $gt: new Date() },
  }).select('+password');

  if (!user) {
    throw new Error('Invalid or expired token');
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;
  await user.save();

  return { success: true };
};

module.exports = {
  forgotPassword,
  resetPassword,
};

