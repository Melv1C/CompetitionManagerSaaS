/*
  Warnings:

  - Added the required column `path` to the `logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "logs" ADD COLUMN     "path" TEXT DEFAULT NULL;
ALTER TABLE "logs" ALTER COLUMN "path" DROP DEFAULT;
