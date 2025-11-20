const authService = require('../../services/auth');
const { sendOTPEmail } = require('../../config/nodemailer');

// Signup
const signup = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    console.log('[AUTH] POST /signup → requested', { email, role });

    // Generate OTP (optional verification)
    const otp = authService.generateOTP();
    const otpExpiry = authService.getOTPExpiry();

    // Create user and get token
    const { user, token } = await authService.signup(email, password, otp, otpExpiry, role);

    // Send OTP email (optional - non-blocking)
    // If email fails, user can still proceed
    try {
      await sendOTPEmail(email, email, otp);
    } catch (emailError) {
      // Log error but don't block signup
      console.error('Failed to send OTP email:', emailError);
    }

    // Build user object conditionally based on role
    const userResponse = {
      id: user._id,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    };

    // Only include adminRole if user role is 'admin' (even if null)
    // Check both user.role from DB and role from request body
    const userRole = user.role || role;
    if (userRole === 'admin') {
      userResponse.adminRole = user.adminRole ?? null;
    }

    const response = {
      success: true,
      message: 'Account created successfully. OTP sent to your email (optional verification).',
      data: {
        token,
        user: userResponse,
      },
    };
    console.log('[AUTH] POST /signup → 201 (created)', { userId: user._id, response });
    res.status(201).json(response);
  } catch (error) {
    console.error('[AUTH] POST /signup → error', error);
    if (error.message === 'User already exists with this email') {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

// Login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log('[AUTH] POST /login → requested', { email });

    const { user, token } = await authService.login(email, password);

    const response = {
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          adminRole: user.adminRole,
          isEmailVerified: user.isEmailVerified,
        },
      },
    };
    console.log('[AUTH] POST /login → 200 (ok)', { userId: user._id, response });
    res.status(200).json(response);
  } catch (error) {
    console.error('[AUTH] POST /login → error', error);
    if (error.message === 'Invalid email or password') {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
    if (error.message === 'Your account has been suspended. Please contact administrator.') {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

// Verify OTP
const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    console.log('[AUTH] POST /verify-otp → requested', { email });

    const { user, token } = await authService.verifyOTP(email, otp);

    const response = {
      success: true,
      message: 'Email verified successfully',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          adminRole: user.adminRole,
          isEmailVerified: user.isEmailVerified,
        },
      },
    };
    console.log('[AUTH] POST /verify-otp → 200 (verified)', { userId: user._id, response });
    res.status(200).json(response);
  } catch (error) {
    console.error('[AUTH] POST /verify-otp → error', error);
    const errorMessages = [
      'User not found',
      'Email is already verified',
      'OTP not found. Please request a new OTP',
      'OTP has expired. Please request a new OTP',
      'Invalid OTP',
    ];
    if (errorMessages.includes(error.message)) {
      const statusCode = error.message === 'User not found' ? 404 : 400;
      return res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
    if (error.message === 'Your account has been suspended. Please contact administrator.') {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

// Resend OTP
const resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log('[AUTH] POST /resend-otp → requested', { email });

    await authService.resendOTP(email);

    const response = {
      success: true,
      message: 'OTP resent to your email',
    };
    console.log('[AUTH] POST /resend-otp → 200 (resent)', { email, response });
    res.status(200).json(response);
  } catch (error) {
    console.error('[AUTH] POST /resend-otp → error', error);
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    if (error.message === 'Email is already verified') {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    // Email sending error
    if (error.message.includes('Failed to send')) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.',
      });
    }
    next(error);
  }
};

// Forgot Password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log(`[AUTH] POST /forgot-password → requested for: ${email}`);

    const result = await authService.forgotPassword(email);

    const response = {
      success: true,
      message: 'If an account with that email exists, a reset link was sent.',
    };
    console.log(`[AUTH] POST /forgot-password → 200`, { response });
    return res.status(200).json(response);
  } catch (error) {
    console.error('[AUTH] POST /forgot-password → error:', error);
    if (error.message === 'Failed to send reset email') {
      return res.status(500).json({ success: false, message: 'Failed to send reset email.' });
    }
    next(error);
  }
};

// Reset Password
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    console.log('[AUTH] POST /reset-password → requested');

    await authService.resetPassword(token, password);

    console.log('[AUTH] POST /reset-password → 200 (password updated)');
    return res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('[AUTH] POST /reset-password → error:', error);
    if (error.message === 'Invalid or expired token') {
      console.log('[AUTH] POST /reset-password → 400 (invalid/expired token)');
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// Get Current User
const getCurrentUser = async (req, res, next) => {
  try {
    console.log('[AUTH] GET /me → requested', { userId: req.user && req.user.id });
    const user = await authService.getCurrentUser(req.user.id);

    const response = {
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          adminRole: user.adminRole,
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
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

// Google: Get OAuth URL
const getGoogleAuthUrl = async (req, res) => {
  try {
    const url = authService.getGoogleAuthUrlService();
    return res.status(200).json({ success: true, data: { url } });
  } catch (error) {
    console.error('[AUTH] GET /google/url → error', error);
    return res.status(500).json({ success: false, message: 'Failed to generate Google auth URL' });
  }
};

// Google: OAuth callback
const googleCallback = async (req, res, next) => {
  try {
    const { code } = req.query;
    console.log('[AUTH] GET /google/callback → requested');

    const { user, token } = await authService.handleGoogleCallback(code);

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

    return res.status(200).json(response);
  } catch (error) {
    console.error('[AUTH] GET /google/callback → error', error);
    if (error.message === 'Missing authorization code' || error.message === 'Google profile has no email') {
      return res.status(400).json({ success: false, message: error.message });
    }
    if (error.message === 'Your account has been suspended. Please contact administrator.') {
      return res.status(403).json({ success: false, message: error.message });
    }
    next(error);
  }
};

module.exports = {
  signup,
  login,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  getGoogleAuthUrl,
  googleCallback,
};

