/*
  Warnings:

  - Added the required column `date` to the `inscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "inscriptions" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT NOW();
ALTER TABLE "inscriptions" ALTER COLUMN "date" DROP DEFAULT;
