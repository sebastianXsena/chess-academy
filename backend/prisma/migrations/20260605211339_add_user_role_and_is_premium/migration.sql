-- AlterEnum
-- NOTE: PostgreSQL requires this to be in its own transaction/migration before the value is used.
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'USER';

