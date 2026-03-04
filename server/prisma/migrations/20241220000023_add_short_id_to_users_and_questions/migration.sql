-- Add short_id column to users table
-- This migration adds a short_id field to the User model for unique short identifiers

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'short_id') THEN
        ALTER TABLE "users" ADD COLUMN "short_id" TEXT;
    END IF;
END $$;

-- Add unique index on short_id for users
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'users_short_id_key'
    ) THEN
        CREATE UNIQUE INDEX "users_short_id_key" ON "users"("short_id") WHERE "short_id" IS NOT NULL;
    END IF;
END $$;

-- Add regular index on short_id for users
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'users_short_id_idx'
    ) THEN
        CREATE INDEX "users_short_id_idx" ON "users"("short_id");
    END IF;
END $$;

-- Add short_id column to questions table
-- This migration adds a short_id field to the Question model for unique short identifiers

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'questions' AND column_name = 'short_id') THEN
        ALTER TABLE "questions" ADD COLUMN "short_id" TEXT;
    END IF;
END $$;

-- Add unique index on short_id for questions
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'questions_short_id_key'
    ) THEN
        CREATE UNIQUE INDEX "questions_short_id_key" ON "questions"("short_id") WHERE "short_id" IS NOT NULL;
    END IF;
END $$;

-- Add regular index on short_id for questions
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'questions_short_id_idx'
    ) THEN
        CREATE INDEX "questions_short_id_idx" ON "questions"("short_id");
    END IF;
END $$;

-- Regenerate Prisma client after this migration

