const connectDB = require('./connection');
const setupConnectionEvents = require('./events');
const setupGracefulShutdown = require('./shutdown');

// Setup event handlers
setupConnectionEvents();
setupGracefulShutdown();

module.exports = connectDB;

