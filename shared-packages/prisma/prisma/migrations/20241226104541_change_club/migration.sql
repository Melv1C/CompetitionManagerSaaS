/*
  Warnings:

  - Added the required column `country` to the `clubs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "clubs" ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "fed_abbr" TEXT,
ADD COLUMN     "fed_number" TEXT,
ADD COLUMN     "province" TEXT,
ALTER COLUMN "address" DROP NOT NULL;
