-- Add flagging fields to questions table
ALTER TABLE "questions" ADD COLUMN "is_flagged" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "questions" ADD COLUMN "flagged_by_id" TEXT;
ALTER TABLE "questions" ADD COLUMN "flag_reason" TEXT;
ALTER TABLE "questions" ADD COLUMN "flag_type" TEXT;
ALTER TABLE "questions" ADD COLUMN "flag_status" TEXT;
ALTER TABLE "questions" ADD COLUMN "flag_reviewed_by_id" TEXT;
ALTER TABLE "questions" ADD COLUMN "flag_rejection_reason" TEXT;

-- CreateIndex
CREATE INDEX "questions_is_flagged_flag_status_idx" ON "questions"("is_flagged", "flag_status");

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_flagged_by_id_fkey" FOREIGN KEY ("flagged_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_flag_reviewed_by_id_fkey" FOREIGN KEY ("flag_reviewed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

