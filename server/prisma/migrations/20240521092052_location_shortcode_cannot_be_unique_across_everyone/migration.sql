/*
  Warnings:

  - You are about to drop the column `organisation` on the `GeoCoordinate` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Location_shortCode_key";

-- AlterTable
ALTER TABLE "GeoCoordinate" DROP COLUMN "organisation";
