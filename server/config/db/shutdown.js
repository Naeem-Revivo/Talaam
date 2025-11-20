const mongoose = require('mongoose');

/**
 * Setup graceful shutdown handlers
 */
const setupGracefulShutdown = () => {
  // Graceful shutdown
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  });
};

module.exports = setupGracefulShutdown;

