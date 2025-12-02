-- CreateTable: Student Answer Questions
CREATE TABLE "student_answer_questions" (
    "id" TEXT NOT NULL,
    "student_answer_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "selected_answer" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "student_answer_questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "student_answer_questions_student_answer_id_idx" ON "student_answer_questions"("student_answer_id");

-- CreateIndex
CREATE INDEX "student_answer_questions_question_id_idx" ON "student_answer_questions"("question_id");

-- AddForeignKey
ALTER TABLE "student_answer_questions" ADD CONSTRAINT "student_answer_questions_student_answer_id_fkey" FOREIGN KEY ("student_answer_id") REFERENCES "student_answers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_answer_questions" ADD CONSTRAINT "student_answer_questions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

