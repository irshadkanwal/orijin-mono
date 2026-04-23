-- AlterTable
ALTER TABLE "Facility" ADD COLUMN     "customLocationId" TEXT;

-- AddForeignKey
ALTER TABLE "Facility" ADD CONSTRAINT "Facility_customLocationId_fkey" FOREIGN KEY ("customLocationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
