/*
  Warnings:

  - You are about to drop the `Club` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Inscription` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `license` on the `athletes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Inscription" DROP CONSTRAINT "Inscription_athlete_license_fkey";

-- DropForeignKey
ALTER TABLE "Inscription" DROP CONSTRAINT "Inscription_competition_event_id_fkey";

-- DropForeignKey
ALTER TABLE "Inscription" DROP CONSTRAINT "Inscription_competition_id_fkey";

-- DropForeignKey
ALTER TABLE "_ClubToCompetition" DROP CONSTRAINT "_ClubToCompetition_A_fkey";

-- DropIndex
DROP INDEX "athletes_license_key";

-- AlterTable
ALTER TABLE "athletes" DROP COLUMN "license",
ADD COLUMN     "license" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Club";

-- DropTable
DROP TABLE "Inscription";

-- CreateTable
CREATE TABLE "clubs" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "abbr" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "clubs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inscriptions" (
    "id" SERIAL NOT NULL,
    "eid" TEXT NOT NULL,
    "athlete_id" INTEGER NOT NULL,
    "competition_event_id" INTEGER NOT NULL,
    "competition_id" INTEGER NOT NULL,
    "paid" INTEGER NOT NULL,
    "confirmed" BOOLEAN NOT NULL,

    CONSTRAINT "inscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "inscriptions_eid_key" ON "inscriptions"("eid");

-- AddForeignKey
ALTER TABLE "inscriptions" ADD CONSTRAINT "inscriptions_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "athletes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscriptions" ADD CONSTRAINT "inscriptions_competition_event_id_fkey" FOREIGN KEY ("competition_event_id") REFERENCES "competition_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscriptions" ADD CONSTRAINT "inscriptions_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClubToCompetition" ADD CONSTRAINT "_ClubToCompetition_A_fkey" FOREIGN KEY ("A") REFERENCES "clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
