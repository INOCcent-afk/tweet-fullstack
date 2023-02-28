/*
  Warnings:

  - You are about to drop the `LikesOnTweet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LikesOnTweet" DROP CONSTRAINT "LikesOnTweet_likeId_fkey";

-- DropForeignKey
ALTER TABLE "LikesOnTweet" DROP CONSTRAINT "LikesOnTweet_tweetId_fkey";

-- DropTable
DROP TABLE "LikesOnTweet";

-- CreateTable
CREATE TABLE "_LikeToTweet" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LikeToTweet_AB_unique" ON "_LikeToTweet"("A", "B");

-- CreateIndex
CREATE INDEX "_LikeToTweet_B_index" ON "_LikeToTweet"("B");

-- AddForeignKey
ALTER TABLE "_LikeToTweet" ADD CONSTRAINT "_LikeToTweet_A_fkey" FOREIGN KEY ("A") REFERENCES "Like"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikeToTweet" ADD CONSTRAINT "_LikeToTweet_B_fkey" FOREIGN KEY ("B") REFERENCES "Tweet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
