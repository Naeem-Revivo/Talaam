-- CreateTable: Users
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

-- CreateIndex
CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_google_id_idx" ON "users"("google_id");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

