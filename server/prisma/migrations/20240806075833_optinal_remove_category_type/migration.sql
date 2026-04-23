/*
  Warnings:

  - Made the column `supportingServiceCategoryTypeId` on table `SupportingServiceCategory` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "SupportingServiceCategory" DROP CONSTRAINT "SupportingServiceCategory_supportingServiceCategoryTypeId_fkey";

-- AlterTable
ALTER TABLE "SupportingServiceCategory" ALTER COLUMN "supportingServiceCategoryTypeId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "SupportingServiceCategory" ADD CONSTRAINT "SupportingServiceCategory_supportingServiceCategoryTypeId_fkey" FOREIGN KEY ("supportingServiceCategoryTypeId") REFERENCES "SupportingServiceCategoryType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
