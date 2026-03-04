-- AlterTable: Add is_marked column to student_answer_questions
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'student_answer_questions' 
        AND column_name = 'is_marked'
    ) THEN
        ALTER TABLE "student_answer_questions" ADD COLUMN "is_marked" BOOLEAN NOT NULL DEFAULT false;
    END IF;
END $$;
