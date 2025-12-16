-- CreateTable: Users (idempotent - checks if table exists first)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        CREATE TABLE "users" (
            "id" TEXT NOT NULL,
            "name" TEXT,
            "authProvider" TEXT NOT NULL DEFAULT 'local',
            "google_id" TEXT,
            "email" TEXT NOT NULL,
            "password" TEXT,
            "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
            "avatar" TEXT,
            "otp" TEXT,
            "otp_expiry" TIMESTAMPTZ,
            "reset_password_token" TEXT,
            "reset_password_expiry" TIMESTAMPTZ,
            "full_name" TEXT,
            "date_of_birth" DATE,
            "country" TEXT,
            "timezone" TEXT,
            "language" TEXT NOT NULL DEFAULT 'English',
            "role" TEXT NOT NULL DEFAULT 'student',
            "admin_role" TEXT,
            "status" TEXT NOT NULL DEFAULT 'active',
            "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMPTZ NOT NULL,

            CONSTRAINT "users_pkey" PRIMARY KEY ("id")
        );
    END IF;
END $$;

-- CreateIndex (idempotent)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'users_google_id_key') THEN
        CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id") WHERE "google_id" IS NOT NULL;
    END IF;
END $$;

-- CreateIndex (idempotent)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'users_email_key') THEN
        CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
    END IF;
END $$;

-- CreateIndex (idempotent)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'users_google_id_idx') THEN
        CREATE INDEX "users_google_id_idx" ON "users"("google_id");
    END IF;
END $$;

-- CreateIndex (idempotent)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'users_email_idx') THEN
        CREATE INDEX "users_email_idx" ON "users"("email");
    END IF;
END $$;

