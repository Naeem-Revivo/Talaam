-- CreateTable: Question History
CREATE TABLE "question_history" (
    "id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "performed_by_id" TEXT NOT NULL,
    "role" TEXT,
    "notes" TEXT,
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "question_history_question_id_idx" ON "question_history"("question_id");

-- AddForeignKey
ALTER TABLE "question_history" ADD CONSTRAINT "question_history_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_history" ADD CONSTRAINT "question_history_performed_by_id_fkey" FOREIGN KEY ("performed_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

