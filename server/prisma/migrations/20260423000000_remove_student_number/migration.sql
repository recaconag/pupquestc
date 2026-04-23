-- AlterTable: remove studentNumber column from users
ALTER TABLE "users" DROP COLUMN IF EXISTS "studentNumber";
