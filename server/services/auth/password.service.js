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

  await User.update(user.id, {
    resetPasswordToken: resetTokenHash,
    resetPasswordExpiry: resetTokenExpiry,
  });

  try {
    await sendPasswordResetEmail(email, user.name || email, resetToken);
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
 * Reset password using token
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

module.exports = {
  forgotPassword,
  resetPassword,
};

