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
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Request logging middleware (for debugging - only log API requests)
app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path === '/health') {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin || 'none'}`);
  }
  next();
});

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
