/*
  Warnings:

  - You are about to drop the column `birthDate` on the `athletes` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `athletes` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `athletes` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user_preferences` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `user_preferences` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `birthdate` to the `athletes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `athletes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `athletes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `user_preferences` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user_preferences" DROP CONSTRAINT "user_preferences_userId_fkey";

-- DropIndex
DROP INDEX "user_preferences_userId_key";

-- AlterTable
ALTER TABLE "athletes" DROP COLUMN "birthDate",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "birthdate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user_preferences" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_user_id_key" ON "user_preferences"("user_id");

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
