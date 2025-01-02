/*
  Warnings:

  - You are about to drop the `_ClubToCompetition` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ClubToCompetition" DROP CONSTRAINT "_ClubToCompetition_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClubToCompetition" DROP CONSTRAINT "_ClubToCompetition_B_fkey";

-- AlterTable
ALTER TABLE "competitions" ADD COLUMN     "club_id" INTEGER;

-- DropTable
DROP TABLE "_ClubToCompetition";

-- CreateTable
CREATE TABLE "_FreeClubsToCompetition" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FreeClubsToCompetition_AB_unique" ON "_FreeClubsToCompetition"("A", "B");

-- CreateIndex
CREATE INDEX "_FreeClubsToCompetition_B_index" ON "_FreeClubsToCompetition"("B");

-- AddForeignKey
ALTER TABLE "competitions" ADD CONSTRAINT "competitions_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FreeClubsToCompetition" ADD CONSTRAINT "_FreeClubsToCompetition_A_fkey" FOREIGN KEY ("A") REFERENCES "clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FreeClubsToCompetition" ADD CONSTRAINT "_FreeClubsToCompetition_B_fkey" FOREIGN KEY ("B") REFERENCES "competitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
