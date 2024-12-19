/*
  Warnings:

  - A unique constraint covering the columns `[eid]` on the table `competition_events` will be added. If there are existing duplicate values, this will fail.
  - The required column `eid` was added to the `competition_events` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "competition_events" DROP CONSTRAINT "competition_events_parent_id_fkey";

-- AlterTable
ALTER TABLE "competition_events" ADD COLUMN     "eid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "competition_events_eid_key" ON "competition_events"("eid");

-- AddForeignKey
ALTER TABLE "competition_events" ADD CONSTRAINT "competition_events_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "competition_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
