/*
  Warnings:

  - Added the required column `is_inscription_visible` to the `competitions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "competitions" ADD COLUMN     "is_inscription_visible" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "competitions" ALTER COLUMN "is_inscription_visible" DROP DEFAULT;
