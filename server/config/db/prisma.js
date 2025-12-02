const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// Vercel Postgres provides POSTGRES_PRISMA_URL for pooled connections
// Priority: POSTGRES_PRISMA_URL (Vercel) > DATABASE_URL (fallback)
// Note: For Prisma schema, DATABASE_URL should be set to POSTGRES_PRISMA_URL on Vercel
const connectionString = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'Database connection string is missing. ' +
    'Please set POSTGRES_PRISMA_URL (for Vercel Postgres) or DATABASE_URL environment variable.'
  );
}

// Create PostgreSQL connection pool with optimized settings for serverless
const pool = new Pool({
  connectionString,
  // Optimize for serverless environments (Vercel)
  max: process.env.VERCEL ? 1 : 10, // Limit connections in serverless
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  // Enable SSL for production (Vercel requires SSL)
  ssl: process.env.NODE_ENV === 'production' || process.env.VERCEL === '1' 
    ? { rejectUnauthorized: false } 
    : false,
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

