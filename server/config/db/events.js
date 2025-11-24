const mongoose = require('mongoose');

/**
 * Setup MongoDB connection event handlers
 */
const setupConnectionEvents = () => {
  // Handle connection events
  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
  });

  mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
  });
};

module.exports = setupConnectionEvents;

