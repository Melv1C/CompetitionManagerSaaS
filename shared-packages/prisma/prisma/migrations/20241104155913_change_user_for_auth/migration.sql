/*
  Warnings:

  - You are about to drop the column `firebase_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_firebase_id_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "firebase_id",
DROP COLUMN "name",
ADD COLUMN     "password" TEXT NOT NULL;
