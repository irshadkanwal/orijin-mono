/*
  Warnings:

  - Made the column `locationId` on table `SupportingServiceActivity` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "SupportingServiceActivity" DROP CONSTRAINT "SupportingServiceActivity_locationId_fkey";

-- AlterTable
ALTER TABLE "SupportingServiceActivity" ADD COLUMN     "description" TEXT,
ALTER COLUMN "locationId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "SupportingServiceActivity" ADD CONSTRAINT "SupportingServiceActivity_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
