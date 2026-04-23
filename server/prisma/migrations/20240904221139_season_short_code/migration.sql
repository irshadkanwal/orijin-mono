/*
  Warnings:

  - Made the column `shortCode` on table `Season` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Season" ALTER COLUMN "shortCode" SET NOT NULL;
