/*
  Warnings:

  - The `access` column on the `admins` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `one_day_permission` column on the `competitions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `gender` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `masterAgeGroup` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `simple_category` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_plan_id` to the `competitions` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `method` on the `competitions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "admins" DROP COLUMN "access",
ADD COLUMN     "access" TEXT[];

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "masterAgeGroup" INTEGER NOT NULL,
ADD COLUMN     "simple_category" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "competitions" ADD COLUMN     "payment_plan_id" INTEGER NOT NULL,
DROP COLUMN "method",
ADD COLUMN     "method" TEXT NOT NULL,
DROP COLUMN "one_day_permission",
ADD COLUMN     "one_day_permission" TEXT[];

-- DropEnum
DROP TYPE "Access";

-- DropEnum
DROP TYPE "EventGroup";

-- DropEnum
DROP TYPE "EventType";

-- DropEnum
DROP TYPE "Method";

-- DropEnum
DROP TYPE "OneDayPermission";

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
CREATE TABLE "_CompetitionToOption" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_OptionToPaymentPlan" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CompetitionToOption_AB_unique" ON "_CompetitionToOption"("A", "B");

-- CreateIndex
CREATE INDEX "_CompetitionToOption_B_index" ON "_CompetitionToOption"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OptionToPaymentPlan_AB_unique" ON "_OptionToPaymentPlan"("A", "B");

-- CreateIndex
CREATE INDEX "_OptionToPaymentPlan_B_index" ON "_OptionToPaymentPlan"("B");

-- AddForeignKey
ALTER TABLE "competitions" ADD CONSTRAINT "competitions_payment_plan_id_fkey" FOREIGN KEY ("payment_plan_id") REFERENCES "payment_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetitionToOption" ADD CONSTRAINT "_CompetitionToOption_A_fkey" FOREIGN KEY ("A") REFERENCES "competitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetitionToOption" ADD CONSTRAINT "_CompetitionToOption_B_fkey" FOREIGN KEY ("B") REFERENCES "options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OptionToPaymentPlan" ADD CONSTRAINT "_OptionToPaymentPlan_A_fkey" FOREIGN KEY ("A") REFERENCES "options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OptionToPaymentPlan" ADD CONSTRAINT "_OptionToPaymentPlan_B_fkey" FOREIGN KEY ("B") REFERENCES "payment_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
