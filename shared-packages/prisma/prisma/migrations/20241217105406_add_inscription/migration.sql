-- CreateTable
CREATE TABLE "Inscription" (
    "id" SERIAL NOT NULL,
    "eid" TEXT NOT NULL,
    "athlete_license" TEXT NOT NULL,
    "competition_event_id" INTEGER NOT NULL,
    "competition_id" INTEGER NOT NULL,
    "paid" INTEGER NOT NULL,
    "confirmed" BOOLEAN NOT NULL,

    CONSTRAINT "Inscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Inscription_eid_key" ON "Inscription"("eid");

-- AddForeignKey
ALTER TABLE "Inscription" ADD CONSTRAINT "Inscription_athlete_license_fkey" FOREIGN KEY ("athlete_license") REFERENCES "athletes"("license") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscription" ADD CONSTRAINT "Inscription_competition_event_id_fkey" FOREIGN KEY ("competition_event_id") REFERENCES "competition_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscription" ADD CONSTRAINT "Inscription_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
