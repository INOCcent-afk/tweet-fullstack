/*
  Warnings:

  - You are about to drop the column `liked` on the `Tweet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tweet" DROP COLUMN "liked",
ADD COLUMN     "likeId" INTEGER;
