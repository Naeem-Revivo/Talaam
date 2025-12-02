import "dotenv/config";
import { defineConfig } from "prisma/config";

// Vercel Postgres provides POSTGRES_PRISMA_DATABASE_URL for pooled connections
// Priority: POSTGRES_PRISMA_DATABASE_URL (Vercel) > POSTGRES_PRISMA_URL (legacy) > DATABASE_URL (fallback)
const connectionUrl = 
  process.env.POSTGRES_PRISMA_DATABASE_URL || 
  process.env.POSTGRES_PRISMA_URL || 
  process.env.DATABASE_URL;

// For migrations, use direct connection (non-pooling) if available
// Vercel Postgres provides POSTGRES_URL for direct connections
const directUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL || connectionUrl;

if (!connectionUrl) {
  throw new Error(
    "Database connection string is missing. " +
    "Please set POSTGRES_PRISMA_DATABASE_URL (for Vercel Postgres) or DATABASE_URL environment variable."
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
