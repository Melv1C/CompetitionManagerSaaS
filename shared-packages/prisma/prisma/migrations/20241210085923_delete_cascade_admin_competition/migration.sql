-- DropForeignKey
ALTER TABLE "admins" DROP CONSTRAINT "admins_competition_id_fkey";

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
