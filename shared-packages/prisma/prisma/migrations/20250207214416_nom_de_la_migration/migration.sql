/*
  Warnings:

  - You are about to drop the `_FreeClubsToCompetition` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `is_fees_additionnal` to the `competitions` table without a default value. This is not possible if the table is not empty.
  - Made the column `end_inscription_date` on table `competitions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `start_inscription_date` on table `competitions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "_FreeClubsToCompetition" DROP CONSTRAINT "_FreeClubsToCompetition_A_fkey";

-- DropForeignKey
ALTER TABLE "_FreeClubsToCompetition" DROP CONSTRAINT "_FreeClubsToCompetition_B_fkey";

-- AlterTable
ALTER TABLE "competitions" ADD COLUMN     "is_fees_additionnal" BOOLEAN NOT NULL default false,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "max_event_by_athlete" INTEGER,
ADD COLUMN     "phone" TEXT,
ALTER COLUMN "end_inscription_date" SET NOT NULL,
ALTER COLUMN "start_inscription_date" SET NOT NULL;

ALTER TABLE "competitions" ALTER COLUMN "is_fees_additionnal" DROP DEFAULT;
-- DropTable
DROP TABLE "_FreeClubsToCompetition";

-- CreateTable
CREATE TABLE "_freeClubsToCompetition" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_allowedClubsToCompetition" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_freeClubsToCompetition_AB_unique" ON "_freeClubsToCompetition"("A", "B");

-- CreateIndex
CREATE INDEX "_freeClubsToCompetition_B_index" ON "_freeClubsToCompetition"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_allowedClubsToCompetition_AB_unique" ON "_allowedClubsToCompetition"("A", "B");

-- CreateIndex
CREATE INDEX "_allowedClubsToCompetition_B_index" ON "_allowedClubsToCompetition"("B");

-- AddForeignKey
ALTER TABLE "_freeClubsToCompetition" ADD CONSTRAINT "_freeClubsToCompetition_A_fkey" FOREIGN KEY ("A") REFERENCES "clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_freeClubsToCompetition" ADD CONSTRAINT "_freeClubsToCompetition_B_fkey" FOREIGN KEY ("B") REFERENCES "competitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_allowedClubsToCompetition" ADD CONSTRAINT "_allowedClubsToCompetition_A_fkey" FOREIGN KEY ("A") REFERENCES "clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_allowedClubsToCompetition" ADD CONSTRAINT "_allowedClubsToCompetition_B_fkey" FOREIGN KEY ("B") REFERENCES "competitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
