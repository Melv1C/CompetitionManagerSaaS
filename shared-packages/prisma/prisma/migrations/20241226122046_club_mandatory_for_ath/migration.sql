/*
  Warnings:

  - Made the column `club_id` on table `athletes` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "athletes" DROP CONSTRAINT "athletes_club_id_fkey";

-- AlterTable
ALTER TABLE "athletes" ALTER COLUMN "club_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
