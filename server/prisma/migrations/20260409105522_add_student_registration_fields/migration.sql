/*
  Warnings:

  - A unique constraint covering the columns `[studentNumber]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "accountStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "accountStatus" "accountStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "idPicture" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "studentNumber" TEXT,
ALTER COLUMN "activated" SET DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "users_studentNumber_key" ON "users"("studentNumber");
