const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

const connectDB = require('../config/db');
const sessionConfig = require('../config/session');
require('../config/passport'); // Initialize Passport strategies

// Create Express app
const app = express();

// Middlewares
// CORS configuration - allow multiple origins for development
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://192.168.1.80:5173',
  'http://192.168.1.136:5173',
  'http://127.0.0.1:5173'
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // For development, allow any localhost or local network IP
      const isLocalhost = origin.includes('localhost') || 
                         origin.includes('127.0.0.1') || 
                         origin.match(/^http:\/\/192\.168\.\d+\.\d+:\d+$/);
      
      if (isLocalhost || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning', 'Ngrok-Skip-Browser-Warning']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware (required for Passport OAuth)
app.use(session(sessionConfig));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session()); // Enable session support for OAuth flows

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
app.use('/api/payment', require('../routes/payment'));
app.use('/api/creator', require('../routes/creator'));
app.use('/api/gatherer', require('../routes/gatherer'));
app.use('/api/explainer', require('../routes/explainer'));
app.use('/api/processor', require('../routes/processor'));
app.use('/api/public', require('../routes/public'));

// Public language routes (for student signup/profile)
const languageController = require('../controllers/admin/language.controller');
app.get('/api/languages/active', languageController.getActiveLanguages);

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

