/*
  Warnings:

  - You are about to drop the column `organisation` on the `Plot` table. All the data in the column will be lost.
  - You are about to drop the column `organisation` on the `Polygon` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Plot" DROP COLUMN "organisation";

-- AlterTable
ALTER TABLE "Polygon" DROP COLUMN "organisation";
