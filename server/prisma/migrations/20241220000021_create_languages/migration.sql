-- Create languages table
-- This migration creates the Language model for managing system languages

CREATE TABLE IF NOT EXISTS "languages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint on code
CREATE UNIQUE INDEX IF NOT EXISTS "languages_code_key" ON "languages"("code");

-- Create indexes
CREATE INDEX IF NOT EXISTS "languages_status_idx" ON "languages"("status");
CREATE INDEX IF NOT EXISTS "languages_is_default_idx" ON "languages"("is_default");

-- Regenerate Prisma client after this migration
