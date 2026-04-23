-- DropForeignKey
ALTER TABLE "SupportingServiceActivity" DROP CONSTRAINT "SupportingServiceActivity_farmerId_fkey";

-- AlterTable
ALTER TABLE "SupportingServiceActivity" ALTER COLUMN "farmerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "SupportingServiceActivity" ADD CONSTRAINT "SupportingServiceActivity_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
