/*
  Warnings:

  - The `retweetId` column on the `Tweet` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Tweet" DROP COLUMN "retweetId",
ADD COLUMN     "retweetId" INTEGER;
