-- Fix users table schema to match Prisma schema
-- This migration ensures the users table has all required columns and constraints

-- Add linkedin_id column if it doesn't exist (mapped from linkedinId in schema)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'linkedin_id') THEN
        ALTER TABLE "users" ADD COLUMN "linkedin_id" TEXT;
    END IF;
END $$;

-- Ensure email column has NOT NULL constraint if missing
DO $$
BEGIN
    -- Check if email column allows NULL
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'email' 
        AND is_nullable = 'YES'
    ) THEN
        -- First, set default for any NULL values
        UPDATE "users" SET "email" = '' WHERE "email" IS NULL;
        -- Then add NOT NULL constraint
        ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL;
    END IF;
END $$;

-- Ensure unique constraint on email exists
DO $$
BEGIN
    -- Drop existing index if it's not unique
    DROP INDEX IF EXISTS "users_email_idx";
    
    -- Create unique constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'users_email_key'
    ) THEN
        CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
    END IF;
    
    -- Recreate regular index
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'users_email_idx'
    ) THEN
        CREATE INDEX "users_email_idx" ON "users"("email");
    END IF;
END $$;

-- Ensure unique constraint on linkedin_id exists (nullable unique)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'users_linkedin_id_key'
    ) THEN
        CREATE UNIQUE INDEX "users_linkedin_id_key" ON "users"("linkedin_id") WHERE "linkedin_id" IS NOT NULL;
    END IF;
END $$;

-- Regenerate Prisma client after this migration

