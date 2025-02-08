-- CreateTable
CREATE TABLE "result_details" (
    "id" SERIAL NOT NULL,
    "try_number" INTEGER NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "attempts" TEXT[],
    "wind" DOUBLE PRECISION,
    "is_best" BOOLEAN NOT NULL,
    "is_official" BOOLEAN NOT NULL,
    "result_id" INTEGER NOT NULL,

    CONSTRAINT "result_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "results" (
    "id" SERIAL NOT NULL,
    "eid" TEXT NOT NULL,
    "competition_id" INTEGER NOT NULL,
    "competition_event_id" INTEGER NOT NULL,
    "athlete_id" INTEGER NOT NULL,
    "inscription_id" INTEGER NOT NULL,
    "bib" INTEGER NOT NULL,
    "club_id" INTEGER NOT NULL,
    "heat" INTEGER NOT NULL,
    "inital_order" INTEGER NOT NULL,
    "temp_order" INTEGER NOT NULL,
    "final_order" INTEGER,
    "value" DOUBLE PRECISION,
    "wind" DOUBLE PRECISION,
    "points" INTEGER,

    CONSTRAINT "results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "results_eid_key" ON "results"("eid");

-- CreateIndex
CREATE UNIQUE INDEX "results_inscription_id_key" ON "results"("inscription_id");

-- AddForeignKey
ALTER TABLE "result_details" ADD CONSTRAINT "result_details_result_id_fkey" FOREIGN KEY ("result_id") REFERENCES "results"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_competition_event_id_fkey" FOREIGN KEY ("competition_event_id") REFERENCES "competition_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "athletes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_inscription_id_fkey" FOREIGN KEY ("inscription_id") REFERENCES "inscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
