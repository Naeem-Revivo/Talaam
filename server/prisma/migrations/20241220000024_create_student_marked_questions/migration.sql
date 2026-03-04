-- CreateTable: Student Marked Questions
CREATE TABLE "student_marked_questions" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "student_marked_questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "student_marked_questions_student_id_question_id_key" ON "student_marked_questions"("student_id", "question_id");

-- CreateIndex
CREATE INDEX "student_marked_questions_student_id_idx" ON "student_marked_questions"("student_id");

-- CreateIndex
CREATE INDEX "student_marked_questions_question_id_idx" ON "student_marked_questions"("question_id");

-- AddForeignKey
ALTER TABLE "student_marked_questions" ADD CONSTRAINT "student_marked_questions_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_marked_questions" ADD CONSTRAINT "student_marked_questions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

