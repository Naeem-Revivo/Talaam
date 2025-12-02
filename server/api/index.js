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

// Vercel serverless function handler
module.exports = async (req, res) => {
  // Ensure database connection
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
    } catch (error) {
      console.error('Database connection error:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Database connection failed',
        message: error.message 
      });
    }
  }
  
  // Handle the request with Express app
  return app(req, res);
};

