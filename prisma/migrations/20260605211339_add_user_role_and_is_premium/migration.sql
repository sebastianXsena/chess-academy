-- AlterEnum
-- PostgreSQL requires the new enum value to be committed before it can be used
ALTER TYPE "Role" ADD VALUE 'USER';

-- The COMMIT above is implicit in Prisma's migration runner when using --no-transaction
-- AlterTable
ALTER TABLE "Material" ADD COLUMN "isPremium" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';
