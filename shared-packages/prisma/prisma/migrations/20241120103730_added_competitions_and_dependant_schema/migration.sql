/*
  Warnings:

  - A unique constraint covering the columns `[eid]` on the table `competitions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `close_date` to the `competitions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `competitions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `competitions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eid` to the `competitions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `competitions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_inscription_date` to the `competitions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `method` to the `competitions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `one_day_bib_start` to the `competitions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publish` to the `competitions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_inscription_date` to the `competitions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Method" AS ENUM ('free', 'online', 'onPlace');

-- CreateEnum
CREATE TYPE "OneDayPermission" AS ENUM ('foreign', 'all', 'bpm');

-- CreateEnum
CREATE TYPE "Access" AS ENUM ('owner', 'inscriptions', 'competitions', 'confirmations', 'liveResults');

-- AlterTable
ALTER TABLE "competitions" ADD COLUMN     "close_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "eid" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "end_inscription_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "free_clubs" TEXT[],
ADD COLUMN     "method" "Method" NOT NULL,
ADD COLUMN     "one_day_bib_start" INTEGER NOT NULL,
ADD COLUMN     "one_day_permission" "OneDayPermission"[],
ADD COLUMN     "publish" BOOLEAN NOT NULL,
ADD COLUMN     "start_inscription_date" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "abbr" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competition_events" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "event_id" INTEGER NOT NULL,
    "schedule" TIMESTAMP(3) NOT NULL,
    "place" INTEGER,
    "parent_id" INTEGER,
    "cost" DOUBLE PRECISION NOT NULL,
    "is_inscription_open" BOOLEAN NOT NULL,
    "competition_id" INTEGER NOT NULL,

    CONSTRAINT "competition_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "competition_id" INTEGER NOT NULL,
    "access" "Access" NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToCompetitionEvent" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_user_id_key" ON "admins"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToCompetitionEvent_AB_unique" ON "_CategoryToCompetitionEvent"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToCompetitionEvent_B_index" ON "_CategoryToCompetitionEvent"("B");

-- CreateIndex
CREATE UNIQUE INDEX "competitions_eid_key" ON "competitions"("eid");

-- AddForeignKey
ALTER TABLE "competition_events" ADD CONSTRAINT "competition_events_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competition_events" ADD CONSTRAINT "competition_events_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "competition_events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competition_events" ADD CONSTRAINT "competition_events_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToCompetitionEvent" ADD CONSTRAINT "_CategoryToCompetitionEvent_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToCompetitionEvent" ADD CONSTRAINT "_CategoryToCompetitionEvent_B_fkey" FOREIGN KEY ("B") REFERENCES "competition_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
