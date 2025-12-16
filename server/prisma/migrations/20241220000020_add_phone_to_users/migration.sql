-- Add phone column to users table
-- This migration adds a phone number field to the User model

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'phone') THEN
        ALTER TABLE "users" ADD COLUMN "phone" TEXT;
    END IF;
END $$;

-- Regenerate Prisma client after this migration

