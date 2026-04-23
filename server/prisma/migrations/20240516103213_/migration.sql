/*
  Warnings:

  - You are about to drop the column `landcoverPngBaselineDate` on the `SatelliteAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `organisation` on the `SatelliteAnalysis` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SatelliteAnalysis" DROP COLUMN "landcoverPngBaselineDate",
DROP COLUMN "organisation",
ALTER COLUMN "area" DROP NOT NULL,
ALTER COLUMN "countryIso" DROP NOT NULL,
ALTER COLUMN "countryRisk" DROP NOT NULL,
ALTER COLUMN "deforestationAreaHa" DROP NOT NULL,
ALTER COLUMN "deforestationRisk" DROP NOT NULL,
ALTER COLUMN "deforestationRisk" SET DATA TYPE TEXT,
ALTER COLUMN "landcoverForestCoverage" DROP NOT NULL,
ALTER COLUMN "landcoverNoTreesCoverage" DROP NOT NULL,
ALTER COLUMN "landcoverPlantationCoverage" DROP NOT NULL,
ALTER COLUMN "landcoverShrubsCoverage" DROP NOT NULL;
