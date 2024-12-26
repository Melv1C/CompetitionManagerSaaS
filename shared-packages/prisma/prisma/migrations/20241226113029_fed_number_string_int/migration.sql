/*
  Warnings:

  - The `fed_number` column on the `clubs` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "clubs" DROP COLUMN "fed_number",
ADD COLUMN     "fed_number" INTEGER;
