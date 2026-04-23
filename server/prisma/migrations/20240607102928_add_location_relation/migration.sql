/*
  Warnings:

  - Added the required column `locationId` to the `SupportingServiceActivity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SupportingServiceActivity" ADD COLUMN     "locationId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "SupportingServiceActivity" ADD CONSTRAINT "SupportingServiceActivity_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
