-- Add assigned_creator_id and assigned_explainer_id columns to questions table
ALTER TABLE "questions" ADD COLUMN "assigned_creator_id" TEXT;
ALTER TABLE "questions" ADD COLUMN "assigned_explainer_id" TEXT;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_assigned_creator_id_fkey" FOREIGN KEY ("assigned_creator_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_assigned_explainer_id_fkey" FOREIGN KEY ("assigned_explainer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

