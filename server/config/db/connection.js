const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 */
const connectDB = async () => {
  try {
    // If already connected, return existing connection
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // Don't exit process in serverless environments
    if (process.env.VERCEL !== '1') {
      process.exit(1);
    }
    throw error;
  }
};

module.exports = connectDB;

