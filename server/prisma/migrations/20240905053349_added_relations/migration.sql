/*
  Warnings:

  - You are about to drop the `_PolygonToPolygonInteractionWarning` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PolygonToPolygonInteractionWarning" DROP CONSTRAINT "_PolygonToPolygonInteractionWarning_A_fkey";

-- DropForeignKey
ALTER TABLE "_PolygonToPolygonInteractionWarning" DROP CONSTRAINT "_PolygonToPolygonInteractionWarning_B_fkey";

-- DropTable
DROP TABLE "_PolygonToPolygonInteractionWarning";

-- CreateTable
CREATE TABLE "_polygonInteractionWarnings" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_polygonInteractionWarnings_AB_unique" ON "_polygonInteractionWarnings"("A", "B");

-- CreateIndex
CREATE INDEX "_polygonInteractionWarnings_B_index" ON "_polygonInteractionWarnings"("B");

-- AddForeignKey
ALTER TABLE "_polygonInteractionWarnings" ADD CONSTRAINT "_polygonInteractionWarnings_A_fkey" FOREIGN KEY ("A") REFERENCES "Polygon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_polygonInteractionWarnings" ADD CONSTRAINT "_polygonInteractionWarnings_B_fkey" FOREIGN KEY ("B") REFERENCES "PolygonInteractionWarning"("id") ON DELETE CASCADE ON UPDATE CASCADE;
