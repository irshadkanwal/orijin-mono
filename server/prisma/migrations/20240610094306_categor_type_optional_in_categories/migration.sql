-- DropForeignKey
ALTER TABLE "SupportingServiceCategory" DROP CONSTRAINT "SupportingServiceCategory_supportingServiceCategoryTypeId_fkey";

-- AlterTable
ALTER TABLE "SupportingServiceCategory" ALTER COLUMN "supportingServiceCategoryTypeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "SupportingServiceCategory" ADD CONSTRAINT "SupportingServiceCategory_supportingServiceCategoryTypeId_fkey" FOREIGN KEY ("supportingServiceCategoryTypeId") REFERENCES "SupportingServiceCategoryType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
