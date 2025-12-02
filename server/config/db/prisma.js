const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// Vercel Postgres provides POSTGRES_PRISMA_DATABASE_URL for pooled connections
// Priority: POSTGRES_PRISMA_DATABASE_URL (Vercel) > POSTGRES_PRISMA_URL (legacy) > DATABASE_URL (fallback)
const connectionString = 
  process.env.POSTGRES_PRISMA_DATABASE_URL || 
  process.env.POSTGRES_PRISMA_URL || 
  process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ Database connection string is missing!');
  console.error('Available env vars:', {
    POSTGRES_PRISMA_DATABASE_URL: !!process.env.POSTGRES_PRISMA_DATABASE_URL,
    POSTGRES_PRISMA_URL: !!process.env.POSTGRES_PRISMA_URL,
    POSTGRES_URL: !!process.env.POSTGRES_URL,
    DATABASE_URL: !!process.env.DATABASE_URL,
    VERCEL: process.env.VERCEL,
    NODE_ENV: process.env.NODE_ENV,
  });
  throw new Error(
    'Database connection string is missing. ' +
    'Please set POSTGRES_PRISMA_DATABASE_URL (for Vercel Postgres) or DATABASE_URL environment variable.'
  );
}

// Log connection info (without sensitive data)
const connectionInfo = connectionString.replace(/:[^:@]+@/, ':****@');
const usingVar = process.env.POSTGRES_PRISMA_DATABASE_URL 
  ? 'POSTGRES_PRISMA_DATABASE_URL' 
  : process.env.POSTGRES_PRISMA_URL 
    ? 'POSTGRES_PRISMA_URL' 
    : 'DATABASE_URL';
console.log('🔌 Database connection:', {
  using: usingVar,
  connection: connectionInfo.substring(0, 50) + '...',
  isVercel: process.env.VERCEL === '1',
  nodeEnv: process.env.NODE_ENV,
});

// Check if connection string requires SSL (Vercel Postgres or sslmode=require)
const requiresSSL = 
  process.env.NODE_ENV === 'production' || 
  process.env.VERCEL === '1' ||
  connectionString.includes('sslmode=require') ||
  connectionString.includes('db.prisma.io') ||
  connectionString.includes('vercel-storage.com');

// Create PostgreSQL connection pool with optimized settings for serverless
const pool = new Pool({
  connectionString,
  // Optimize for serverless environments (Vercel)
  max: process.env.VERCEL ? 1 : 10, // Limit connections in serverless
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000, // Increased timeout for serverless
  // Enable SSL for production/Vercel or when connection string requires it
  ssl: requiresSSL 
    ? { rejectUnauthorized: false } 
    : false,
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
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
    // Test connection with a simple query
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ PostgreSQL Connected via Prisma');
    return prisma;
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
      connectionString: connectionString ? connectionString.substring(0, 30) + '...' : 'missing',
    });
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

