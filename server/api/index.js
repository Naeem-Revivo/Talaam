const app = require('../server');
const connectDB = require('../config/db');

// Ensure database is connected before handling requests
let dbConnected = false;

const ensureDBConnection = async () => {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
    } catch (error) {
      console.error('Database connection error:', error);
      throw error;
    }
  }
};

// Vercel serverless function handler
module.exports = async (req, res) => {
  // Ensure database connection
  try {
    await ensureDBConnection();
  } catch (error) {
    return res.status(500).json({ 
      error: 'Database connection failed',
      message: error.message 
    });
  }
  
  // Handle the request with Express app
  return app(req, res);
};

