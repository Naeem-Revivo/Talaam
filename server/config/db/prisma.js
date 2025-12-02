const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create Prisma adapter for PostgreSQL
const adapter = new PrismaPg(pool);

// Prisma 7 requires adapter to be provided
const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

/**
 * Connect to PostgreSQL database using Prisma
 */
const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('PostgreSQL Connected via Prisma');
    return prisma;
  } catch (error) {
    console.error('PostgreSQL connection error:', error.message);
    // Don't exit process in serverless environments
    if (process.env.VERCEL !== '1') {
      process.exit(1);
    }
    throw error;
  }
};

/**
 * Disconnect from database
 */
const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    console.log('PostgreSQL Disconnected');
  } catch (error) {
    console.error('Error disconnecting from PostgreSQL:', error.message);
    throw error;
  }
};

module.exports = { prisma, connectDB, disconnectDB };

