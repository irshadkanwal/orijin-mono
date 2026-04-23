/*
  Warnings:

  - You are about to drop the `Variety` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PlotToVariety` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductToVariety` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Variety" DROP CONSTRAINT "Variety_cropId_fkey";

-- DropForeignKey
ALTER TABLE "_PlotToVariety" DROP CONSTRAINT "_PlotToVariety_A_fkey";

-- DropForeignKey
ALTER TABLE "_PlotToVariety" DROP CONSTRAINT "_PlotToVariety_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToVariety" DROP CONSTRAINT "_ProductToVariety_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToVariety" DROP CONSTRAINT "_ProductToVariety_B_fkey";

-- DropTable
DROP TABLE "Variety";

-- DropTable
DROP TABLE "_PlotToVariety";

-- DropTable
DROP TABLE "_ProductToVariety";

-- CreateTable
CREATE TABLE "CropVariety" (
    "id" TEXT NOT NULL,
    "shortCode" TEXT,
    "organisation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "cropId" TEXT NOT NULL,

    CONSTRAINT "CropVariety_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CropVarietyToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CropVarietyToPlot" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CropVariety_shortCode_key" ON "CropVariety"("shortCode");

-- CreateIndex
CREATE UNIQUE INDEX "_CropVarietyToProduct_AB_unique" ON "_CropVarietyToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_CropVarietyToProduct_B_index" ON "_CropVarietyToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CropVarietyToPlot_AB_unique" ON "_CropVarietyToPlot"("A", "B");

-- CreateIndex
CREATE INDEX "_CropVarietyToPlot_B_index" ON "_CropVarietyToPlot"("B");

-- AddForeignKey
ALTER TABLE "CropVariety" ADD CONSTRAINT "CropVariety_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "Crop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CropVarietyToProduct" ADD CONSTRAINT "_CropVarietyToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "CropVariety"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CropVarietyToProduct" ADD CONSTRAINT "_CropVarietyToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CropVarietyToPlot" ADD CONSTRAINT "_CropVarietyToPlot_A_fkey" FOREIGN KEY ("A") REFERENCES "CropVariety"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CropVarietyToPlot" ADD CONSTRAINT "_CropVarietyToPlot_B_fkey" FOREIGN KEY ("B") REFERENCES "Plot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
