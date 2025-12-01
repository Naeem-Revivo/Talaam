-- CreateTable: Question Comments
CREATE TABLE "question_comments" (
    "id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "commented_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "question_comments_question_id_idx" ON "question_comments"("question_id");

-- AddForeignKey
ALTER TABLE "question_comments" ADD CONSTRAINT "question_comments_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_comments" ADD CONSTRAINT "question_comments_commented_by_id_fkey" FOREIGN KEY ("commented_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

