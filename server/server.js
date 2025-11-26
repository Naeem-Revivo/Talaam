const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  };

  startServer();
}

module.exports = app;
