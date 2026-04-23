/*
  Warnings:

  - You are about to drop the column `polygonIdA` on the `PolygonInteractionWarning` table. All the data in the column will be lost.
  - You are about to drop the column `polygonIdB` on the `PolygonInteractionWarning` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[polygonIds]` on the table `PolygonInteractionWarning` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "PolygonInteractionWarning" DROP CONSTRAINT "PolygonInteractionWarning_polygonIdA_fkey";

-- DropForeignKey
ALTER TABLE "PolygonInteractionWarning" DROP CONSTRAINT "PolygonInteractionWarning_polygonIdB_fkey";

-- AlterTable
ALTER TABLE "PolygonInteractionWarning" DROP COLUMN "polygonIdA",
DROP COLUMN "polygonIdB",
ADD COLUMN     "polygonIds" TEXT[];

-- CreateTable
CREATE TABLE "_PolygonToPolygonInteractionWarning" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PolygonToPolygonInteractionWarning_AB_unique" ON "_PolygonToPolygonInteractionWarning"("A", "B");

-- CreateIndex
CREATE INDEX "_PolygonToPolygonInteractionWarning_B_index" ON "_PolygonToPolygonInteractionWarning"("B");

-- CreateIndex
CREATE UNIQUE INDEX "PolygonInteractionWarning_polygonIds_key" ON "PolygonInteractionWarning"("polygonIds");

-- AddForeignKey
ALTER TABLE "_PolygonToPolygonInteractionWarning" ADD CONSTRAINT "_PolygonToPolygonInteractionWarning_A_fkey" FOREIGN KEY ("A") REFERENCES "Polygon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PolygonToPolygonInteractionWarning" ADD CONSTRAINT "_PolygonToPolygonInteractionWarning_B_fkey" FOREIGN KEY ("B") REFERENCES "PolygonInteractionWarning"("id") ON DELETE CASCADE ON UPDATE CASCADE;
