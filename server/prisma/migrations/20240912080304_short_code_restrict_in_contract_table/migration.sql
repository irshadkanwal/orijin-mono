/*
  Warnings:

  - You are about to drop the column `polygonIds` on the `PolygonInteractionWarning` table. All the data in the column will be lost.
  - Made the column `shortCode` on table `Contact` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "PolygonInteractionWarning_polygonIds_key";

-- AlterTable
ALTER TABLE "Contact" ALTER COLUMN "shortCode" SET NOT NULL;

-- AlterTable
ALTER TABLE "PolygonInteractionWarning" DROP COLUMN "polygonIds";
