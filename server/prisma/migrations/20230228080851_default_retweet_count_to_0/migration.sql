-- AlterTable
ALTER TABLE "Tweet" ALTER COLUMN "retweetCount" DROP NOT NULL,
ALTER COLUMN "retweetCount" SET DEFAULT 0;
