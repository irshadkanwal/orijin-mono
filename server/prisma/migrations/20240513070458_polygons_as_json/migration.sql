/*
  Warnings:

  - You are about to drop the column `polygonMinimized` on the `GeoPolygon` table. All the data in the column will be lost.
  - You are about to drop the column `polygonRaw` on the `GeoPolygon` table. All the data in the column will be lost.
  - You are about to alter the column `polygon` on the `GeoPolygon` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("polygon")` to `JsonB`.
  - Made the column `polygon` on table `GeoPolygon` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "GeoPolygon" DROP COLUMN "polygonMinimized",
DROP COLUMN "polygonRaw",
DROP COLUMN "polygon",
ADD COLUMN "polygon" JSONB NOT NULL;
