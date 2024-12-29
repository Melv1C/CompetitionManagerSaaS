/*
  Warnings:

  - You are about to drop the column `masterAgeGroup` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `simple_category` on the `categories` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[abbr]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `abbr_base_category` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "categories" DROP COLUMN "masterAgeGroup",
DROP COLUMN "simple_category",
ADD COLUMN     "abbr_base_category" TEXT NOT NULL,
ADD COLUMN     "master_age_group" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_abbr_key" ON "categories"("abbr");
