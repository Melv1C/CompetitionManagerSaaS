/*
  Warnings:

  - Made the column `metadata` on table `logs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "logs" ALTER COLUMN "metadata" SET NOT NULL;
