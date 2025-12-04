const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

const connectDB = require('./config/db');
const sessionConfig = require('./config/session');
require('./config/passport'); // Initialize Passport strategies

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware (required for Passport OAuth)
app.use(session(sessionConfig));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session()); // Enable session support for OAuth flows

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/profile'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/student', require('./routes/student'));
app.use('/api/subscription', require('./routes/subscription'));
app.use('/api/payment', require('./routes/payment'));

// Error handling middleware
const errorHandler = require('./middlewares/error');
app.use(errorHandler);

// Database connection - connect on first request in serverless
// Don't connect at module load time in serverless (Vercel)
// Connection will be handled by the API handler
let dbConnected = false;
const connectDBOnce = async () => {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
};

// Start subscription expiry scheduled job
// Runs daily at midnight (00:00) to update expired subscriptions
// Set ENABLE_SUBSCRIPTION_CRON=false in .env to disable
// Note: Cron jobs are disabled in serverless environments (Vercel)
// Use Vercel Cron Jobs or a separate cron endpoint instead
if (process.env.VERCEL !== '1' && process.env.ENABLE_SUBSCRIPTION_CRON !== 'false') {
  const { startSubscriptionExpiryJob } = require('./jobs/subscription');
  startSubscriptionExpiryJob();
}

// Only start server if not in serverless environment (Vercel)
if (process.env.VERCEL !== '1') {
  const startServer = async () => {
    try {
      await connectDBOnce();
      
      const PORT = process.env.PORT || 5000;
      // Sanitize HOST: remove protocol prefixes (http://, https://) and trailing slashes
      let HOST = process.env.HOST || '0.0.0.0';
      HOST = HOST.replace(/^https?:\/\//, '').replace(/\/$/, '');
      app.listen(PORT, HOST, () => {
        console.log(`Server running on http://${HOST}:${PORT}`);
        console.log(`Server accessible on network at http://${HOST}:${PORT}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  };

  startServer();
}

module.exports = app;
