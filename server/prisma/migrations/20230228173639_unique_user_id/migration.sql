/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Like" ALTER COLUMN "like" SET DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_key" ON "Like"("userId");
