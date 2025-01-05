/*
  Warnings:

  - Added the required column `is_deleted` to the `competitions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_absent` to the `inscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_deleted` to the `inscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "competitions" ADD COLUMN "is_deleted" BOOLEAN NOT NULL DEFAULT false;


ALTER TABLE "competitions" ALTER COLUMN "is_deleted" DROP DEFAULT;


ALTER TABLE "inscriptions" ADD COLUMN "is_absent" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "inscriptions" ADD COLUMN "is_deleted" BOOLEAN NOT NULL DEFAULT false;


ALTER TABLE "inscriptions" ALTER COLUMN "is_absent" DROP DEFAULT;
ALTER TABLE "inscriptions" ALTER COLUMN "is_deleted" DROP DEFAULT;
