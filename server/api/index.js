const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('../config/db');

// Create Express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api', require('../routes/profile'));
app.use('/api/admin', require('../routes/admin'));
app.use('/api/student', require('../routes/student'));
app.use('/api/subscription', require('../routes/subscription'));

// Error handling middleware
const errorHandler = require('../middlewares/error');
app.use(errorHandler);

// Database connection state
let dbConnected = false;
let connectionAttempts = 0;
const MAX_CONNECTION_ATTEMPTS = 3;

// Vercel serverless function handler
module.exports = async (req, res) => {
  // Ensure database connection
  if (!dbConnected) {
    try {
      connectionAttempts++;
      console.log(`[DB] Attempting database connection (attempt ${connectionAttempts})...`);
      
      // Log environment info for debugging
      if (connectionAttempts === 1) {
        console.log('[DB] Environment check:', {
          hasPostgresPrismaUrl: !!process.env.POSTGRES_PRISMA_URL,
          hasDatabaseUrl: !!process.env.DATABASE_URL,
          isVercel: process.env.VERCEL === '1',
          nodeEnv: process.env.NODE_ENV,
        });
      }
      
      await connectDB();
      dbConnected = true;
      console.log('[DB] Database connection established successfully');
    } catch (error) {
      console.error('[DB] Database connection error:', {
        message: error.message,
        code: error.code,
        meta: error.meta,
        stack: error.stack?.substring(0, 200),
      });
      
      // Reset connection state after max attempts to allow retry
      if (connectionAttempts >= MAX_CONNECTION_ATTEMPTS) {
        dbConnected = false;
        connectionAttempts = 0;
      }
      
      return res.status(500).json({ 
        success: false,
        error: 'Database connection failed',
        message: process.env.NODE_ENV === 'production' 
          ? 'Server error. Please try again later or contact support if the problem persists.'
          : error.message,
        details: process.env.NODE_ENV === 'development' ? {
          code: error.code,
          meta: error.meta,
        } : undefined,
      });
    }
  }
  
  // Handle the request with Express app
  return app(req, res);
};

