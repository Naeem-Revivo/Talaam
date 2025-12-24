-- AlterTable: Add description column to exams table
-- Check if column exists before adding (idempotent migration)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'exams' 
        AND column_name = 'description'
    ) THEN
        ALTER TABLE "exams" ADD COLUMN "description" TEXT;
    END IF;
END $$;

