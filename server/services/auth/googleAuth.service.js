const User = require('../../models/user');
const { oauth2Client, getGoogleAuthUrl } = require('../../config/google');
const { generateToken } = require('../../config/jwt');
const { google } = require('googleapis');

/**
 * Get Google OAuth URL
 */
const getGoogleAuthUrlService = () => {
  return getGoogleAuthUrl();
};

/**
 * Handle Google OAuth callback
 */
const handleGoogleCallback = async (code) => {
  if (!code) {
    throw new Error('Missing authorization code');
  }

  // Exchange code for tokens
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // Get user profile from Google
  const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' });
  const { data: profile } = await oauth2.userinfo.get();

  const email = (profile && profile.email) || '';
  const googleId = (profile && profile.id) || '';
  const name = (profile && profile.name) || '';
  const avatar = (profile && profile.picture) || '';

  if (!email) {
    throw new Error('Google profile has no email');
  }

  // Find or create user
  let user = await User.findByEmail(email);
  if (!user) {
    // Create new user
    user = await User.create({
      name,
      email,
      authProvider: 'google',
      googleId,
      isEmailVerified: true,
      avatar,
    });
  } else if (user && user.authProvider !== 'google') {
    // If existing local account, link provider details but keep local
    await User.update(user.id, {
      googleId: user.googleId || googleId,
      avatar: user.avatar || avatar,
    });
    user = await User.findById(user.id);
  }

  // Check if user is suspended
  if (user.status === 'suspended') {
    throw new Error('Account suspended. Please contact support team.');
  }

  // Generate token
  const token = generateToken(user.id);

  return {
    user,
    token,
  };
};

module.exports = {
  getGoogleAuthUrlService,
  handleGoogleCallback,
};

