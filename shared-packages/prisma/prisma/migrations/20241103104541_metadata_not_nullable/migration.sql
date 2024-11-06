/*
  Warnings:

  - Made the column `metadata` on table `athletes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
UPDATE "athletes" SET "metadata" = '{}' WHERE "metadata" IS NULL;

ALTER TABLE "athletes" ALTER COLUMN "metadata" SET NOT NULL,
ALTER COLUMN "metadata" SET DEFAULT '{}';
