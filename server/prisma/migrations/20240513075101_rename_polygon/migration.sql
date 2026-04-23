/*
  Warnings:

  - You are about to drop the `GeoPolygon` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GeoPolygon" DROP CONSTRAINT "GeoPolygon_plotId_fkey";

-- DropTable
DROP TABLE "GeoPolygon";

-- CreateTable
CREATE TABLE "Polygon" (
    "id" TEXT NOT NULL,
    "shortCode" TEXT,
    "organisation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL,
    "status" TEXT,
    "areaCalculated" DECIMAL(65,30),
    "areaManual" DECIMAL(65,30),
    "coordinates" JSONB NOT NULL,
    "source" TEXT NOT NULL,
    "plotId" TEXT NOT NULL,

    CONSTRAINT "Polygon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Polygon_shortCode_key" ON "Polygon"("shortCode");

-- AddForeignKey
ALTER TABLE "Polygon" ADD CONSTRAINT "Polygon_plotId_fkey" FOREIGN KEY ("plotId") REFERENCES "Plot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
