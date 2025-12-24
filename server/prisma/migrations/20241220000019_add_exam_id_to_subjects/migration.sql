-- AlterTable: Add exam_id column to subjects table
-- Check if column exists before adding (idempotent migration)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'subjects' 
        AND column_name = 'exam_id'
    ) THEN
        ALTER TABLE "subjects" ADD COLUMN "exam_id" TEXT;
        
        -- Add foreign key constraint
        ALTER TABLE "subjects" 
        ADD CONSTRAINT "subjects_exam_id_fkey" 
        FOREIGN KEY ("exam_id") 
        REFERENCES "exams"("id") 
        ON DELETE SET NULL 
        ON UPDATE CASCADE;
        
        -- Add index for better query performance
        CREATE INDEX IF NOT EXISTS "subjects_exam_id_idx" ON "subjects"("exam_id");
    END IF;
END $$;

