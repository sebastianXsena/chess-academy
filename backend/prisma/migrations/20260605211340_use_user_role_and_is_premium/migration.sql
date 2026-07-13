-- This migration depends on 20260605211339 having committed the 'USER' enum value first.

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';

-- AlterTable
ALTER TABLE "Material" ADD COLUMN IF NOT EXISTS "isPremium" BOOLEAN NOT NULL DEFAULT false;
