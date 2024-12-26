/*
  Warnings:

  - You are about to drop the column `club` on the `athletes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "athletes" DROP COLUMN "club",
ADD COLUMN     "club_id" INTEGER;

-- AddForeignKey
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
