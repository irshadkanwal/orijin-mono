-- DropForeignKey
ALTER TABLE "SupportingServiceActivity" DROP CONSTRAINT "SupportingServiceActivity_locationId_fkey";

-- AlterTable
ALTER TABLE "SupportingServiceActivity" ADD COLUMN     "userType" TEXT,
ALTER COLUMN "locationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "SupportingServiceActivity" ADD CONSTRAINT "SupportingServiceActivity_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
