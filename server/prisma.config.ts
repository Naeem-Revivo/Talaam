import "dotenv/config";
import { defineConfig } from "prisma/config";

// Vercel Postgres provides POSTGRES_PRISMA_URL for pooled connections
// Priority: POSTGRES_PRISMA_URL (Vercel) > DATABASE_URL (fallback)
const connectionUrl = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;

// For migrations, use direct connection (non-pooling) if available
// Vercel Postgres provides POSTGRES_URL_NON_POOLING for direct connections
const directUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL || connectionUrl;

if (!connectionUrl) {
  throw new Error(
    "Database connection string is missing. " +
    "Please set POSTGRES_PRISMA_URL (for Vercel Postgres) or DATABASE_URL environment variable."
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Primary connection URL (pooled for Vercel Postgres)
    url: connectionUrl,
    // Direct connection URL for migrations (non-pooling)
    directUrl: directUrl,
  },
});
