/*
  Warnings:

  - You are about to drop the column `free_clubs` on the `competitions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "competitions" DROP COLUMN "free_clubs";

-- CreateTable
CREATE TABLE "Club" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "abbr" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClubToCompetition" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ClubToCompetition_AB_unique" ON "_ClubToCompetition"("A", "B");

-- CreateIndex
CREATE INDEX "_ClubToCompetition_B_index" ON "_ClubToCompetition"("B");

-- AddForeignKey
ALTER TABLE "_ClubToCompetition" ADD CONSTRAINT "_ClubToCompetition_A_fkey" FOREIGN KEY ("A") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClubToCompetition" ADD CONSTRAINT "_ClubToCompetition_B_fkey" FOREIGN KEY ("B") REFERENCES "competitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
