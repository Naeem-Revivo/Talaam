const User = require('../models/User.model');
const crypto = require('crypto');
const { sendOTPEmail, sendPasswordResetEmail } = require('../config/nodemailer.config');
const { generateToken } = require('../config/jwt.config');
const { oauth2Client, getGoogleAuthUrl } = require('../config/google.config');
const { google } = require('googleapis');

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Signup
exports.signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log('[AUTH] POST /signup → requested', { email });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Generate OTP (optional verification)
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    // Create user
    const user = await User.create({
      email,
      password,
      otp,
      otpExpiry,
    });

    // Generate token immediately after signup
    const token = generateToken(user._id);

    // Send OTP email (optional - non-blocking)
    // If email fails, user can still proceed
    try {
      await sendOTPEmail(email, email, otp);
    } catch (emailError) {
      // Log error but don't block signup
      console.error('Failed to send OTP email:', emailError);
    }

    const response = {
      success: true,
      message: 'Account created successfully. OTP sent to your email (optional verification).',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
        },
      },
    };
    console.log('[AUTH] POST /signup → 201 (created)', { userId: user._id, response });
    res.status(201).json(response);
  } catch (error) {
    console.error('[AUTH] POST /signup → error', error);
    next(error);
  }
};

// Google: Get OAuth URL
exports.getGoogleAuthUrl = async (req, res) => {
  try {
    const url = getGoogleAuthUrl();
    return res.status(200).json({ success: true, data: { url } });
  } catch (error) {
    console.error('[AUTH] GET /google/url → error', error);
    return res.status(500).json({ success: false, message: 'Failed to generate Google auth URL' });
  }
};

// Google: OAuth callback (handles ?code=)
exports.googleCallback = async (req, res, next) => {
  try {
    const { code } = req.query;
    console.log('[AUTH] GET /google/callback → requested');

    if (!code) {
      return res.status(400).json({ success: false, message: 'Missing authorization code' });
    }

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' });
    const { data: profile } = await oauth2.userinfo.get();

    const email = (profile && profile.email) || '';
    const googleId = (profile && profile.id) || '';
    const name = (profile && profile.name) || '';
    const avatar = (profile && profile.picture) || '';

    if (!email) {
      return res.status(400).json({ success: false, message: 'Google profile has no email' });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        authProvider: 'google',
        googleId,
        isEmailVerified: true,
        avatar,
        // No password for google users
      });
    } else if (user && user.authProvider !== 'google') {
      // If existing local account, link provider details but keep local
      user.googleId = user.googleId || googleId;
      user.avatar = user.avatar || avatar;
      await user.save({ validateBeforeSave: false });
    }

    const token = generateToken(user._id);
    const response = {
      success: true,
      message: 'Google login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
          avatar: user.avatar,
        },
      },
    };

    // If this endpoint is being used by SPA, just return JSON
    return res.status(200).json(response);
  } catch (error) {
    console.error('[AUTH] GET /google/callback → error', error);
    next(error);
  }
};

// Verify OTP
exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    console.log('[AUTH] POST /verify-otp → requested', { email });

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if email is already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified',
      });
    }

    // Check if OTP exists
    if (!user.otp) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found. Please request a new OTP',
      });
    }

    // Check if OTP is expired
    if (new Date() > user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP',
      });
    }

    // Verify OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    // Update user
    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    const response = {
      success: true,
      message: 'Email verified successfully',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
        },
      },
    };
    console.log('[AUTH] POST /verify-otp → 200 (verified)', { userId: user._id, response });
    res.status(200).json(response);
  } catch (error) {
    console.error('[AUTH] POST /verify-otp → error', error);
    next(error);
  }
};

// Resend OTP
exports.resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log('[AUTH] POST /resend-otp → requested', { email });

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if email is already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified',
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    // Update user
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP email (use email if name not provided)
    try {
      await sendOTPEmail(email, user.name || email, otp);
    } catch (emailError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.',
      });
    }

    const response = {
      success: true,
      message: 'OTP resent to your email',
    };
    console.log('[AUTH] POST /resend-otp → 200 (resent)', { userId: user._id, response });
    res.status(200).json(response);
  } catch (error) {
    console.error('[AUTH] POST /resend-otp → error', error);
    next(error);
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log('[AUTH] POST /login → requested', { email });

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password (email verification is optional, no check needed)
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    const response = {
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
        },
      },
    };
    console.log('[AUTH] POST /login → 200 (ok)', { userId: user._id, response });
    res.status(200).json(response);
  } catch (error) {
    console.error('[AUTH] POST /login → error', error);
    next(error);
  }
};

// Get current user (protected route)
exports.getCurrentUser = async (req, res, next) => {
  try {
    console.log('[AUTH] GET /me → requested', { userId: req.user && req.user.id });
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const response = {
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
          fullName: user.fullName,
          dateOfBirth: user.dateOfBirth,
          country: user.country,
          timezone: user.timezone,
          language: user.language,
        },
      },
    };
    console.log('[AUTH] GET /me → 200 (ok)', { userId: user._id, response });
    res.status(200).json(response);
  } catch (error) {
    console.error('[AUTH] GET /me → error', error);
    next(error);
  }
};

// Forgot Password - Request password reset
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log(`[AUTH] POST /forgot-password → requested for: ${email}`);

    const user = await User.findOne({ email });
    if (!user) {
      const response = {
        success: true,
        message: 'If an account with that email exists, a reset link was sent.',
      };
      console.log(`[AUTH] POST /forgot-password → 200 (user not revealed)`, { response });
      return res.status(200).json(response);
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpiry = resetTokenExpiry;
    await user.save({ validateBeforeSave: false });

    try {
      await sendPasswordResetEmail(email, user.name || email, resetToken);
      const response = {
        success: true,
        message: 'If an account with that email exists, a reset link was sent.',
      };
      console.log(`[AUTH] POST /forgot-password → 200 (email sent)`, { response });
      return res.status(200).json(response);
    } catch (emailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpiry = undefined;
      await user.save({ validateBeforeSave: false });
      console.log(`[AUTH] POST /forgot-password → 500 (email send failed)`);
      return res.status(500).json({ success: false, message: 'Failed to send reset email.' });
    }
  } catch (error) {
    console.error('[AUTH] POST /forgot-password → error:', error);
    next(error);
  }
};

// Reset Password - Use token to set new password
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    console.log('[AUTH] POST /reset-password → requested');

    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpiry: { $gt: new Date() },
    }).select('+password');

    if (!user) {
      console.log('[AUTH] POST /reset-password → 400 (invalid/expired token)');
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    console.log('[AUTH] POST /reset-password → 200 (password updated)');
    return res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('[AUTH] POST /reset-password → error:', error);
    next(error);
  }
};

