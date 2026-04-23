/*
  Warnings:

  - You are about to drop the column `point` on the `GeoCoordinate` table. All the data in the column will be lost.
  - Added the required column `latitude` to the `GeoCoordinate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `GeoCoordinate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GeoCoordinate" DROP COLUMN "point",
ADD COLUMN     "latitude" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "longitude" DECIMAL(65,30) NOT NULL;
