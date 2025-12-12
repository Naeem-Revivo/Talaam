const authService = require('../../services/auth');
const { sendOTPEmail } = require('../../config/nodemailer');
const passport = require('passport');
const { generateToken } = require('../../config/jwt');
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
      id: user.id,
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
    console.log('[AUTH] POST /signup → 201 (created)', { userId: user.id, response });
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
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          adminRole: user.adminRole,
          isEmailVerified: user.isEmailVerified,
        },
      },
    };
    console.log('[AUTH] POST /login → 200 (ok)', { userId: user.id, response });
    res.status(200).json(response);
  } catch (error) {
    console.error('[AUTH] POST /login → error', error);
    if (error.message === 'Invalid email or password') {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
    if (error.message === 'Account suspended. Please contact support team.') {
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
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          adminRole: user.adminRole,
          isEmailVerified: user.isEmailVerified,
        },
      },
    };
    console.log('[AUTH] POST /verify-otp → 200 (verified)', { userId: user.id, response });
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
    if (error.message === 'Account suspended. Please contact support team.') {
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

// Forgot Password (sends reset link)
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

// Forgot Password OTP (sends OTP for profile page)
const forgotPasswordOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log(`[AUTH] POST /forgot-password-otp → requested for: ${email}`);

    await authService.forgotPasswordOTP(email);

    const response = {
      success: true,
      message: 'OTP code sent to your email.',
    };
    console.log(`[AUTH] POST /forgot-password-otp → 200`, { response });
    return res.status(200).json(response);
  } catch (error) {
    console.error('[AUTH] POST /forgot-password-otp → error:', error);
    if (error.message === 'User not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message === 'Failed to send OTP email') {
      return res.status(500).json({ success: false, message: 'Failed to send OTP email.' });
    }
    next(error);
  }
};

// Reset Password (using token from link)
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

// Reset Password OTP (using OTP from profile page)
const resetPasswordOTP = async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;
    console.log('[AUTH] POST /reset-password-otp → requested');

    await authService.resetPasswordOTP(email, otp, password);

    console.log('[AUTH] POST /reset-password-otp → 200 (password updated)');
    return res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('[AUTH] POST /reset-password-otp → error:', error);
    const errorMessages = [
      'User not found',
      'OTP not found. Please request a new OTP',
      'OTP has expired. Please request a new OTP',
      'Invalid OTP',
    ];
    if (errorMessages.includes(error.message)) {
      console.log(`[AUTH] POST /reset-password-otp → 400 (${error.message})`);
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
          id: user.id,
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
    console.log('[AUTH] GET /me → 200 (ok)', { userId: user.id, response });
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

// Google: Get OAuth URL (for backward compatibility, redirects directly to OAuth flow)
const getGoogleAuthUrl = async (req, res) => {
  try {
    // Redirect directly to start OAuth flow instead of returning JSON
    // This maintains backward compatibility while using the new Passport.js flow
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    // Get the base API URL
    const apiBaseUrl = req.protocol + '://' + req.get('host');
    // Redirect to the OAuth endpoint
    return res.redirect(`${apiBaseUrl}/api/auth/google`);
  } catch (error) {
    console.error('[AUTH] GET /google/url → error', error);
    return res.status(500).json({ success: false, message: 'Failed to generate Google auth URL' });
  }
};

// Google: Start OAuth flow
const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

// Google: OAuth callback
const googleCallback = (req, res, next) => {
  console.log('[AUTH] Google callback received', {
    query: req.query,
    hasCode: !!req.query.code,
    hasError: !!req.query.error
  });

  // Check for OAuth error from Google
  if (req.query.error) {
    console.error('[AUTH] Google OAuth error from provider:', req.query.error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const errorMessage = req.query.error_description || req.query.error || 'Authentication failed';
      return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(errorMessage)}`);
  }

  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) {
      console.error('[AUTH] Google callback error:', err);
      console.error('[AUTH] Error stack:', err.stack);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(err.message || 'Authentication failed')}`);
    }

    if (!user) {
      console.error('[AUTH] Google callback: No user returned', { info });
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('Authentication failed - user not found')}`);
    }

    try {
      // Generate JWT token
      const token = generateToken(user.id);

      // Check if user is newly created or existing
      const isNewUser = info?.isNewUser || false;
      
      // Redirect to frontend with token and account status
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      console.log('[AUTH] Google OAuth successful', { userId: user.id, email: user.email, isNewUser });
      res.redirect(`${frontendUrl}/auth/callback?token=${token}&provider=google&isNewUser=${isNewUser}`);
    } catch (tokenError) {
      console.error('[AUTH] Error generating token:', tokenError);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('Failed to generate authentication token')}`);
    }
  })(req, res, next);
};

// LinkedIn: Get OAuth URL (for backward compatibility, redirects directly to OAuth flow)
const getLinkedInAuthUrl = async (req, res) => {
  try {
    // Redirect directly to start OAuth flow instead of returning JSON
    // This maintains backward compatibility while using the new Passport.js flow
    const apiBaseUrl = req.protocol + '://' + req.get('host');
    // Redirect to the OAuth endpoint
    return res.redirect(`${apiBaseUrl}/api/auth/linkedin`);
  } catch (error) {
    console.error('[AUTH] GET /linkedin/url → error', error);
    return res.status(500).json({ success: false, message: 'Failed to generate LinkedIn auth URL' });
  }
};

// LinkedIn: Start OAuth flow
const linkedinAuth = passport.authenticate('linkedin', {
  scope: ['r_liteprofile', 'r_emailaddress'],
});

// LinkedIn: OAuth callback
const linkedinCallback = (req, res, next) => {
  passport.authenticate('linkedin', { session: false }, (err, user, info) => {
    if (err) {
      console.error('[AUTH] LinkedIn callback error:', err);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(err.message)}`);
    }

    if (!user) {
      console.error('[AUTH] LinkedIn callback: No user returned');
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('Authentication failed')}`);
    }

    try {
      // Generate JWT token
      const token = generateToken(user.id);

      // Check if user is newly created or existing
      const isNewUser = info?.isNewUser || false;

      // Redirect to frontend with token and account status
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      console.log('[AUTH] LinkedIn OAuth successful', { userId: user.id, email: user.email, isNewUser });
      res.redirect(`${frontendUrl}/auth/callback?token=${token}&provider=linkedin&isNewUser=${isNewUser}`);
    } catch (tokenError) {
      console.error('[AUTH] Error generating token:', tokenError);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('Failed to generate authentication token')}`);
    }
  })(req, res, next);
};

module.exports = {
  signup,
  login,
  verifyOTP,
  resendOTP,
  forgotPassword,
  forgotPasswordOTP,
  resetPassword,
  resetPasswordOTP,
  getCurrentUser,
  getGoogleAuthUrl,
  googleAuth,
  googleCallback,
  getLinkedInAuthUrl,
  linkedinAuth,
  linkedinCallback,
};

