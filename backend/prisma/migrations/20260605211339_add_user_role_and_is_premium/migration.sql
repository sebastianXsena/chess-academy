-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'USER';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';

-- AlterTable
ALTER TABLE "Material" ADD COLUMN "isPremium" BOOLEAN NOT NULL DEFAULT false;
