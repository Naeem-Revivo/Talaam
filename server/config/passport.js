const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const User = require('../models/user');
const { generateToken } = require('./jwt');

// Serialize user for session (if using sessions)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const googleId = profile.id;
        const name = profile.displayName || profile.name?.givenName;
        const avatar = profile.photos?.[0]?.value;

        if (!email) {
          return done(new Error('Google profile has no email'), null);
        }

        // Find or create user
        let user = await User.findByEmail(email);
        let isNewUser = false;
        
        if (!user) {
          // Create new user
          isNewUser = true;
          user = await User.create({
            name,
            email,
            authProvider: 'google',
            googleId,
            isEmailVerified: true,
            avatar,
          });
        } else if (user.authProvider !== 'google') {
          // Link Google account to existing user (existing user, logging in)
          isNewUser = false;
          await User.update(user.id, {
            googleId: user.googleId || googleId,
            avatar: user.avatar || avatar,
          });
          user = await User.findById(user.id);
        } else {
          // Existing Google user (logging in)
          isNewUser = false;
          // Update existing Google user info if needed
          if (!user.googleId) {
            await User.update(user.id, { googleId });
            user = await User.findById(user.id);
          }
        }

        // Check if user is suspended
        if (user.status === 'suspended') {
          return done(new Error('Account suspended. Please contact support team.'), null);
        }

        // Pass user and isNewUser flag through info parameter
        return done(null, user, { isNewUser });
      } catch (error) {
        console.error('[PASSPORT] Google strategy error:', error);
        return done(error, null);
      }
    }
  )
);

// LinkedIn Strategy
passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: process.env.LINKEDIN_REDIRECT_URI || 'http://localhost:5000/api/auth/linkedin/callback',
      scope: ['r_liteprofile', 'r_emailaddress'],
      state: true, // CSRF protection
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const linkedinId = profile.id;
        const firstName = profile.name?.givenName || '';
        const lastName = profile.name?.familyName || '';
        const name = profile.displayName || `${firstName} ${lastName}`.trim();
        const avatar = profile.photos?.[0]?.value;

        if (!email) {
          return done(new Error('LinkedIn profile has no email'), null);
        }

        // Find or create user
        let user = await User.findByEmail(email);
        let isNewUser = false;
        
        if (!user) {
          // Create new user
          isNewUser = true;
          user = await User.create({
            name,
            email,
            authProvider: 'linkedin',
            linkedinId,
            isEmailVerified: true,
            avatar,
          });
        } else if (user.authProvider !== 'linkedin') {
          // Link LinkedIn account to existing user (existing user, logging in)
          isNewUser = false;
          await User.update(user.id, {
            linkedinId: user.linkedinId || linkedinId,
            avatar: user.avatar || avatar,
          });
          user = await User.findById(user.id);
        } else {
          // Existing LinkedIn user (logging in)
          isNewUser = false;
          // Update existing LinkedIn user info if needed
          if (!user.linkedinId) {
            await User.update(user.id, { linkedinId });
            user = await User.findById(user.id);
          }
        }

        // Check if user is suspended
        if (user.status === 'suspended') {
          return done(new Error('Account suspended. Please contact support team.'), null);
        }

        // Pass user and isNewUser flag through info parameter
        return done(null, user, { isNewUser });
      } catch (error) {
        console.error('[PASSPORT] LinkedIn strategy error:', error);
        return done(error, null);
      }
    }
  )
);

module.exports = passport;

