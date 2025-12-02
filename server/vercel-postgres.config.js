/**
 * Vercel Postgres Configuration
 * 
 * This file contains configuration helpers for Vercel Postgres deployment.
 * 
 * Vercel Postgres provides three connection strings:
 * 1. POSTGRES_PRISMA_URL - Pooled connection (use for Prisma Client queries)
 * 2. POSTGRES_URL - Direct connection (use for migrations)
 * 3. POSTGRES_URL_NON_POOLING - Non-pooling connection (alternative for migrations)
 * 
 * Environment Variables Required:
 * - POSTGRES_PRISMA_URL (for Prisma Client - pooled connection)
 * - POSTGRES_URL_NON_POOLING (for Prisma Migrate - direct connection)
 * - DATABASE_URL (fallback, can be set to POSTGRES_PRISMA_URL)
 */

/**
 * Get the appropriate database URL based on environment
 * @returns {string} Database connection string
 */
function getDatabaseUrl() {
  // Vercel Postgres provides POSTGRES_PRISMA_URL for pooled connections
  if (process.env.POSTGRES_PRISMA_URL) {
    return process.env.POSTGRES_PRISMA_URL;
  }
  
  // Fallback to DATABASE_URL for other providers
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  
  throw new Error(
    'Database connection string is missing. ' +
    'Please set POSTGRES_PRISMA_URL (for Vercel Postgres) or DATABASE_URL environment variable.'
  );
}

/**
 * Get the direct database URL for migrations
 * @returns {string} Direct database connection string
 */
function getDirectDatabaseUrl() {
  // Vercel Postgres provides POSTGRES_URL_NON_POOLING for direct connections
  if (process.env.POSTGRES_URL_NON_POOLING) {
    return process.env.POSTGRES_URL_NON_POOLING;
  }
  
  // Fallback to POSTGRES_URL (Vercel) or DATABASE_URL
  if (process.env.POSTGRES_URL) {
    return process.env.POSTGRES_URL;
  }
  
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  
  throw new Error(
    'Direct database connection string is missing. ' +
    'Please set POSTGRES_URL_NON_POOLING (for Vercel Postgres) or DATABASE_URL environment variable.'
  );
}

/**
 * Check if running on Vercel
 * @returns {boolean}
 */
function isVercel() {
  return process.env.VERCEL === '1' || !!process.env.VERCEL;
}

/**
 * Check if using Vercel Postgres
 * @returns {boolean}
 */
function isVercelPostgres() {
  return !!process.env.POSTGRES_PRISMA_URL;
}

module.exports = {
  getDatabaseUrl,
  getDirectDatabaseUrl,
  isVercel,
  isVercelPostgres,
};

