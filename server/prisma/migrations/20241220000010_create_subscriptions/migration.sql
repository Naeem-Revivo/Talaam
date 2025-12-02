-- CreateTable: Subscriptions
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "plan_name" TEXT NOT NULL,
    "start_date" TIMESTAMPTZ NOT NULL,
    "expiry_date" TIMESTAMPTZ NOT NULL,
    "payment_status" TEXT NOT NULL DEFAULT 'Pending',
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "transaction_id" TEXT,
    "payment_method" TEXT NOT NULL DEFAULT 'manual',
    "moyassar_payment_id" TEXT,
    "moyassar_payment_status" TEXT,
    "payment_url" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "subscriptions_user_id_is_active_expiry_date_idx" ON "subscriptions"("user_id", "is_active", "expiry_date");

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

