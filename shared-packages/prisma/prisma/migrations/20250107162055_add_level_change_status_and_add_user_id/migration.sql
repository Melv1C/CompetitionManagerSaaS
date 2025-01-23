/*
  Warnings:

  - The `status` column on the `logs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `level` to the `logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "logs" ADD COLUMN     "level" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" INTEGER,
ALTER COLUMN "metadata" DROP NOT NULL;
