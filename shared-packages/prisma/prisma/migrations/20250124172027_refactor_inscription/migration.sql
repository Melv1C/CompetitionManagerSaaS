/*
  Warnings:

  - You are about to drop the column `is_absent` on the `inscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `is_confirmed` on the `inscriptions` table. All the data in the column will be lost.
  - Added the required column `bib` to the `inscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `club_id` to the `inscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `inscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `inscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "inscriptions" DROP COLUMN "is_absent",
DROP COLUMN "is_confirmed",
ADD COLUMN     "bib" INTEGER NOT NULL,
ADD COLUMN     "club_id" INTEGER NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "records" (
    "id" SERIAL NOT NULL,
    "perf" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "inscription_id" INTEGER NOT NULL,

    CONSTRAINT "records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "records_inscription_id_key" ON "records"("inscription_id");

-- AddForeignKey
ALTER TABLE "inscriptions" ADD CONSTRAINT "inscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscriptions" ADD CONSTRAINT "inscriptions_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "records" ADD CONSTRAINT "records_inscription_id_fkey" FOREIGN KEY ("inscription_id") REFERENCES "inscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
