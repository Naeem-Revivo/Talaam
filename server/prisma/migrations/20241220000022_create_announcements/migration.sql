-- Create announcements table
-- This migration creates the Announcement and AnnouncementRead models

CREATE TABLE IF NOT EXISTS "announcements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "target_audience" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "start_date" TIMESTAMPTZ NOT NULL,
    "end_date" TIMESTAMPTZ NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'inactive',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- Create announcement_reads table
CREATE TABLE IF NOT EXISTS "announcement_reads" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "announcement_id" TEXT NOT NULL,
    "read_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "announcement_reads_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint on announcement_reads
CREATE UNIQUE INDEX IF NOT EXISTS "announcement_reads_user_id_announcement_id_key" ON "announcement_reads"("user_id", "announcement_id");

-- Create indexes for announcements
CREATE INDEX IF NOT EXISTS "announcements_target_audience_idx" ON "announcements"("target_audience");
CREATE INDEX IF NOT EXISTS "announcements_is_published_idx" ON "announcements"("is_published");
CREATE INDEX IF NOT EXISTS "announcements_status_idx" ON "announcements"("status");
CREATE INDEX IF NOT EXISTS "announcements_start_date_end_date_idx" ON "announcements"("start_date", "end_date");

-- Create indexes for announcement_reads
CREATE INDEX IF NOT EXISTS "announcement_reads_user_id_idx" ON "announcement_reads"("user_id");
CREATE INDEX IF NOT EXISTS "announcement_reads_announcement_id_idx" ON "announcement_reads"("announcement_id");
CREATE INDEX IF NOT EXISTS "announcement_reads_is_deleted_idx" ON "announcement_reads"("is_deleted");

-- Add foreign key constraints
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'announcement_reads_user_id_fkey'
    ) THEN
        ALTER TABLE "announcement_reads" 
        ADD CONSTRAINT "announcement_reads_user_id_fkey" 
        FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'announcement_reads_announcement_id_fkey'
    ) THEN
        ALTER TABLE "announcement_reads" 
        ADD CONSTRAINT "announcement_reads_announcement_id_fkey" 
        FOREIGN KEY ("announcement_id") REFERENCES "announcements"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

