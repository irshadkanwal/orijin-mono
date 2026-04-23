/*
  Warnings:

  - Added the required column `source` to the `GeoPolygon` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Farm" DROP CONSTRAINT "Farm_seasonId_fkey";

-- AlterTable
ALTER TABLE "Farm" ALTER COLUMN "seasonId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "GeoPolygon" ADD COLUMN     "source" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "SatelliteAnalysis" (
    "id" TEXT NOT NULL,
    "organisation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "plotId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "parcelId" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "area" DECIMAL(65,30) NOT NULL,
    "countryIso" TEXT NOT NULL,
    "countryRisk" TEXT NOT NULL,
    "deforestationAreaHa" DECIMAL(65,30) NOT NULL,
    "deforestationRisk" DECIMAL(65,30) NOT NULL,
    "landcoverForestCoverage" DECIMAL(65,30) NOT NULL,
    "landcoverNoTreesCoverage" DECIMAL(65,30) NOT NULL,
    "landcoverPlantationCoverage" DECIMAL(65,30) NOT NULL,
    "landcoverShrubsCoverage" DECIMAL(65,30) NOT NULL,
    "landcoverPngBaselineDate" TIMESTAMP(3) NOT NULL,
    "rawData" JSONB NOT NULL,

    CONSTRAINT "SatelliteAnalysis_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Farm" ADD CONSTRAINT "Farm_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SatelliteAnalysis" ADD CONSTRAINT "SatelliteAnalysis_plotId_fkey" FOREIGN KEY ("plotId") REFERENCES "Plot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
