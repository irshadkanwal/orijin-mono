/*
  Warnings:

  - You are about to drop the column `cultivationStartDate` on the `Farm` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Farm" DROP COLUMN "cultivationStartDate";

-- AlterTable
ALTER TABLE "Plot" ADD COLUMN     "status" TEXT;
