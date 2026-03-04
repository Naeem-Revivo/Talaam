-- AlterTable
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'student_answers' 
        AND column_name = 'remaining_time'
    ) THEN
        ALTER TABLE "student_answers" ADD COLUMN "remaining_time" INTEGER;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'student_answers' 
        AND column_name = 'time_limit'
    ) THEN
        ALTER TABLE "student_answers" ADD COLUMN "time_limit" INTEGER;
    END IF;
END $$;
