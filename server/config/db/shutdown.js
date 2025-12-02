const { disconnectDB } = require('./prisma');

/**
 * Setup graceful shutdown handlers
 */
const setupGracefulShutdown = () => {
  // Graceful shutdown
  process.on('SIGINT', async () => {
    await disconnectDB();
    console.log('PostgreSQL connection closed through app termination');
    process.exit(0);
  });
};

module.exports = setupGracefulShutdown;

