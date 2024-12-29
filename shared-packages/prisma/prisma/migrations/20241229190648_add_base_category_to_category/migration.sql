/*
  Warnings:

  - Added the required column `base_category` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "base_category" TEXT NOT NULL;
