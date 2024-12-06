-- AlterTable
ALTER TABLE "competitions" ALTER COLUMN "close_date" DROP NOT NULL,
ALTER COLUMN "end_inscription_date" DROP NOT NULL,
ALTER COLUMN "start_inscription_date" DROP NOT NULL;
