/*
  Warnings:

  - You are about to drop the column `confirmed` on the `inscriptions` table. All the data in the column will be lost.
  - Added the required column `is_confirmed` to the `inscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "inscriptions" DROP COLUMN "confirmed",
ADD COLUMN     "is_confirmed" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "inscriptions" ALTER COLUMN "is_confirmed" DROP DEFAULT;