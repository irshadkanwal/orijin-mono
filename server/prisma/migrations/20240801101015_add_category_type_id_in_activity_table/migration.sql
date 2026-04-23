-- AlterTable
ALTER TABLE "SupportingServiceActivity" ADD COLUMN     "supportingServiceCategoryTypeId" TEXT;

-- AddForeignKey
ALTER TABLE "SupportingServiceActivity" ADD CONSTRAINT "SupportingServiceActivity_supportingServiceCategoryTypeId_fkey" FOREIGN KEY ("supportingServiceCategoryTypeId") REFERENCES "SupportingServiceCategoryType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
