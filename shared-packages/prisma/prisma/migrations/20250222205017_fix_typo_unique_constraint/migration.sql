/*
  Warnings:

  - You are about to drop the column `inital_order` on the `results` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[result_id,try_number]` on the table `result_details` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[competition_event_id,athlete_id]` on the table `results` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `initial_order` to the `results` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "results" DROP COLUMN "inital_order",
ADD COLUMN     "initial_order" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "result_details_result_id_try_number_key" ON "result_details"("result_id", "try_number");

-- CreateIndex
CREATE UNIQUE INDEX "results_competition_event_id_athlete_id_key" ON "results"("competition_event_id", "athlete_id");
