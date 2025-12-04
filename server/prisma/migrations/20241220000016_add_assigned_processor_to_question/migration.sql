-- Add assigned_processor_id column to questions table
ALTER TABLE "questions" ADD COLUMN "assigned_processor_id" TEXT;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_assigned_processor_id_fkey" FOREIGN KEY ("assigned_processor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

