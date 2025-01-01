-- AlterTable
ALTER TABLE "users" ADD COLUMN     "club_id" INTEGER;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
