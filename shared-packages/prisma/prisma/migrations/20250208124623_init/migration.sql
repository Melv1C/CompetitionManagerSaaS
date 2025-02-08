-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "club_id" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "theme" TEXT NOT NULL,
    "language" TEXT NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "athletes" (
    "id" SERIAL NOT NULL,
    "license" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "bib" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "club_id" INTEGER NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "competition_id" INTEGER,

    CONSTRAINT "athletes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "abbr" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "abbr" TEXT NOT NULL,
    "base_category" TEXT NOT NULL,
    "abbr_base_category" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "master_age_group" INTEGER,
    "order" INTEGER NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competition_events" (
    "id" SERIAL NOT NULL,
    "eid" TEXT NOT NULL,
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
CREATE TABLE "competitions" (
    "id" SERIAL NOT NULL,
    "eid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "publish" BOOLEAN NOT NULL,
    "method" TEXT NOT NULL,
    "is_fees_additionnal" BOOLEAN NOT NULL,
    "start_inscription_date" TIMESTAMP(3) NOT NULL,
    "end_inscription_date" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "close_date" TIMESTAMP(3),
    "one_day_permission" TEXT[],
    "one_day_bib_start" INTEGER NOT NULL,
    "payment_plan_id" INTEGER NOT NULL,
    "club_id" INTEGER,
    "location" TEXT,
    "is_deleted" BOOLEAN NOT NULL,
    "max_event_by_athlete" INTEGER,

    CONSTRAINT "competitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "competition_id" INTEGER NOT NULL,
    "access" TEXT[],

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "options" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_plans" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "payment_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clubs" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "abbr" TEXT NOT NULL,
    "address" TEXT,
    "province" TEXT,
    "country" TEXT NOT NULL,
    "fed_number" INTEGER,
    "fed_abbr" TEXT,

    CONSTRAINT "clubs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inscriptions" (
    "id" SERIAL NOT NULL,
    "eid" TEXT NOT NULL,
    "athlete_id" INTEGER NOT NULL,
    "competition_event_id" INTEGER NOT NULL,
    "competition_id" INTEGER NOT NULL,
    "paid" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "bib" INTEGER NOT NULL,
    "club_id" INTEGER NOT NULL,
    "is_deleted" BOOLEAN NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "records" (
    "id" SERIAL NOT NULL,
    "perf" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "inscription_id" INTEGER NOT NULL,

    CONSTRAINT "records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs" (
    "id" SERIAL NOT NULL,
    "level" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "path" TEXT,
    "status" INTEGER,
    "userId" INTEGER,
    "message" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "_CategoryToCompetitionEvent" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CompetitionToOption" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_OptionToPaymentPlan" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_freeClubsToCompetition" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_allowedClubsToCompetition" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_user_id_key" ON "user_preferences"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "events_name_key" ON "events"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_abbr_key" ON "categories"("abbr");

-- CreateIndex
CREATE UNIQUE INDEX "competition_events_eid_key" ON "competition_events"("eid");

-- CreateIndex
CREATE UNIQUE INDEX "competitions_eid_key" ON "competitions"("eid");

-- CreateIndex
CREATE UNIQUE INDEX "clubs_abbr_key" ON "clubs"("abbr");

-- CreateIndex
CREATE UNIQUE INDEX "inscriptions_eid_key" ON "inscriptions"("eid");

-- CreateIndex
CREATE UNIQUE INDEX "records_inscription_id_key" ON "records"("inscription_id");

-- CreateIndex
CREATE UNIQUE INDEX "results_eid_key" ON "results"("eid");

-- CreateIndex
CREATE UNIQUE INDEX "results_inscription_id_key" ON "results"("inscription_id");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToCompetitionEvent_AB_unique" ON "_CategoryToCompetitionEvent"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToCompetitionEvent_B_index" ON "_CategoryToCompetitionEvent"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CompetitionToOption_AB_unique" ON "_CompetitionToOption"("A", "B");

-- CreateIndex
CREATE INDEX "_CompetitionToOption_B_index" ON "_CompetitionToOption"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OptionToPaymentPlan_AB_unique" ON "_OptionToPaymentPlan"("A", "B");

-- CreateIndex
CREATE INDEX "_OptionToPaymentPlan_B_index" ON "_OptionToPaymentPlan"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_freeClubsToCompetition_AB_unique" ON "_freeClubsToCompetition"("A", "B");

-- CreateIndex
CREATE INDEX "_freeClubsToCompetition_B_index" ON "_freeClubsToCompetition"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_allowedClubsToCompetition_AB_unique" ON "_allowedClubsToCompetition"("A", "B");

-- CreateIndex
CREATE INDEX "_allowedClubsToCompetition_B_index" ON "_allowedClubsToCompetition"("B");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competition_events" ADD CONSTRAINT "competition_events_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competition_events" ADD CONSTRAINT "competition_events_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "competition_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competition_events" ADD CONSTRAINT "competition_events_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competitions" ADD CONSTRAINT "competitions_payment_plan_id_fkey" FOREIGN KEY ("payment_plan_id") REFERENCES "payment_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competitions" ADD CONSTRAINT "competitions_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscriptions" ADD CONSTRAINT "inscriptions_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "athletes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscriptions" ADD CONSTRAINT "inscriptions_competition_event_id_fkey" FOREIGN KEY ("competition_event_id") REFERENCES "competition_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscriptions" ADD CONSTRAINT "inscriptions_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscriptions" ADD CONSTRAINT "inscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscriptions" ADD CONSTRAINT "inscriptions_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "records" ADD CONSTRAINT "records_inscription_id_fkey" FOREIGN KEY ("inscription_id") REFERENCES "inscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "_CategoryToCompetitionEvent" ADD CONSTRAINT "_CategoryToCompetitionEvent_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToCompetitionEvent" ADD CONSTRAINT "_CategoryToCompetitionEvent_B_fkey" FOREIGN KEY ("B") REFERENCES "competition_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetitionToOption" ADD CONSTRAINT "_CompetitionToOption_A_fkey" FOREIGN KEY ("A") REFERENCES "competitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetitionToOption" ADD CONSTRAINT "_CompetitionToOption_B_fkey" FOREIGN KEY ("B") REFERENCES "options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OptionToPaymentPlan" ADD CONSTRAINT "_OptionToPaymentPlan_A_fkey" FOREIGN KEY ("A") REFERENCES "options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OptionToPaymentPlan" ADD CONSTRAINT "_OptionToPaymentPlan_B_fkey" FOREIGN KEY ("B") REFERENCES "payment_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_freeClubsToCompetition" ADD CONSTRAINT "_freeClubsToCompetition_A_fkey" FOREIGN KEY ("A") REFERENCES "clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_freeClubsToCompetition" ADD CONSTRAINT "_freeClubsToCompetition_B_fkey" FOREIGN KEY ("B") REFERENCES "competitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_allowedClubsToCompetition" ADD CONSTRAINT "_allowedClubsToCompetition_A_fkey" FOREIGN KEY ("A") REFERENCES "clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_allowedClubsToCompetition" ADD CONSTRAINT "_allowedClubsToCompetition_B_fkey" FOREIGN KEY ("B") REFERENCES "competitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
