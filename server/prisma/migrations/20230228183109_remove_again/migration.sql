/*
  Warnings:

  - You are about to drop the column `tweetId` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `likeId` on the `Tweet` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_tweetId_fkey";

-- AlterTable
ALTER TABLE "Like" DROP COLUMN "tweetId";

-- AlterTable
ALTER TABLE "Tweet" DROP COLUMN "likeId";

-- CreateTable
CREATE TABLE "LikesOnTweet" (
    "tweetId" INTEGER NOT NULL,
    "likeId" INTEGER NOT NULL,

    CONSTRAINT "LikesOnTweet_pkey" PRIMARY KEY ("tweetId","likeId")
);

-- AddForeignKey
ALTER TABLE "LikesOnTweet" ADD CONSTRAINT "LikesOnTweet_tweetId_fkey" FOREIGN KEY ("tweetId") REFERENCES "Tweet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikesOnTweet" ADD CONSTRAINT "LikesOnTweet_likeId_fkey" FOREIGN KEY ("likeId") REFERENCES "Like"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
