require('dotenv').config();

// Vercel Postgres provides POSTGRES_PRISMA_DATABASE_URL for pooled connections
// However, if it's a Prisma Accelerate URL (prisma+postgres://), prefer direct connection
// For migrations, always use direct connection (non-pooling) if available
// Priority: POSTGRES_URL_NON_POOLING > POSTGRES_URL > POSTGRES_PRISMA_DATABASE_URL (if not Accelerate) > POSTGRES_PRISMA_URL > DATABASE_URL

// Check if POSTGRES_PRISMA_DATABASE_URL is a Prisma Accelerate URL
const isAccelerateUrl = process.env.POSTGRES_PRISMA_DATABASE_URL?.startsWith('prisma+postgres://');

// For migrations, prefer direct connection
const migrationUrl = 
  process.env.POSTGRES_URL_NON_POOLING || 
  process.env.POSTGRES_URL ||
  (isAccelerateUrl ? null : process.env.POSTGRES_PRISMA_DATABASE_URL) ||
  process.env.POSTGRES_PRISMA_URL || 
  process.env.DATABASE_URL;

if (!migrationUrl) {
  throw new Error(
    "Database connection string is missing. " +
    "Please set POSTGRES_URL (for Vercel Postgres direct connection) or DATABASE_URL environment variable."
  );
}

module.exports = {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: migrationUrl,
  },
};

