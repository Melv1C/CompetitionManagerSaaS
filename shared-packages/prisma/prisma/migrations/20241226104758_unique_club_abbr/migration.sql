/*
  Warnings:

  - A unique constraint covering the columns `[abbr]` on the table `clubs` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "clubs_abbr_key" ON "clubs"("abbr");
