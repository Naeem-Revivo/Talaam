-- CreateTable: Topics
CREATE TABLE "topics" (
    "id" TEXT NOT NULL,
    "parent_subject" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "topics_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_parent_subject_fkey" FOREIGN KEY ("parent_subject") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

