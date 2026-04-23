/*
  Warnings:

  - You are about to drop the column `category` on the `SupportingServiceActivity` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `SupportingServiceActivity` table. All the data in the column will be lost.
  - You are about to drop the column `userType` on the `SupportingServiceActivity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ServiceActivityBeneficiaries" ADD COLUMN     "grade" DECIMAL(65,30),
ADD COLUMN     "itemValue" DECIMAL(65,30),
ADD COLUMN     "itemsProcessed" DECIMAL(65,30),
ADD COLUMN     "primary" BOOLEAN,
ADD COLUMN     "score" DECIMAL(65,30),
ADD COLUMN     "total" DECIMAL(65,30),
ADD COLUMN     "values" JSONB;

-- AlterTable
ALTER TABLE "SupportingServiceActivity" DROP COLUMN "category",
DROP COLUMN "type",
DROP COLUMN "userType",
ADD COLUMN     "supportingServiceActivityTypeId" TEXT,
ADD COLUMN     "supportingServiceInputTypeId" TEXT;

-- CreateTable
CREATE TABLE "SupportingServiceActivityType" (
    "id" TEXT NOT NULL,
    "shortCode" TEXT,
    "organisation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT,
    "supportingServiceInputTypeId" TEXT,

    CONSTRAINT "SupportingServiceActivityType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportingServiceInputType" (
    "id" TEXT NOT NULL,
    "shortCode" TEXT,
    "organisation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT,

    CONSTRAINT "SupportingServiceInputType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SupportingServiceActivityType" ADD CONSTRAINT "SupportingServiceActivityType_supportingServiceInputTypeId_fkey" FOREIGN KEY ("supportingServiceInputTypeId") REFERENCES "SupportingServiceInputType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportingServiceActivity" ADD CONSTRAINT "SupportingServiceActivity_supportingServiceInputTypeId_fkey" FOREIGN KEY ("supportingServiceInputTypeId") REFERENCES "SupportingServiceInputType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportingServiceActivity" ADD CONSTRAINT "SupportingServiceActivity_supportingServiceActivityTypeId_fkey" FOREIGN KEY ("supportingServiceActivityTypeId") REFERENCES "SupportingServiceActivityType"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- AlterTable
ALTER TABLE "SupportingServiceActivityType" ADD COLUMN     "supportingServiceCategoryId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "SupportingServiceActivityType" ADD CONSTRAINT "SupportingServiceActivityType_supportingServiceCategoryId_fkey" FOREIGN KEY ("supportingServiceCategoryId") REFERENCES "SupportingServiceCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- AlterTable
ALTER TABLE "SupportingServiceInputType" ADD COLUMN     "supportingServiceCategoryId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "SupportingServiceInputType" ADD CONSTRAINT "SupportingServiceInputType_supportingServiceCategoryId_fkey" FOREIGN KEY ("supportingServiceCategoryId") REFERENCES "SupportingServiceCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- CreateIndex
CREATE UNIQUE INDEX "SupportingServiceActivityType_shortCode_organisation_key" ON "SupportingServiceActivityType"("shortCode", "organisation");

-- CreateIndex
CREATE UNIQUE INDEX "SupportingServiceInputType_shortCode_organisation_key" ON "SupportingServiceInputType"("shortCode", "organisation");

-- CreateIndex
CREATE UNIQUE INDEX "Price_shortCode_organisation_key" ON "Price"("shortCode", "organisation");


-- AlterTable
ALTER TABLE "SupportingServiceActivityType" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SupportingServiceInputType" ALTER COLUMN "description" DROP NOT NULL;

-- DropForeignKey
ALTER TABLE "SupportingServiceActivity" DROP CONSTRAINT "SupportingServiceActivity_supportingServiceActivityTypeId_fkey";

-- AlterTable
ALTER TABLE "SupportingServiceActivity" DROP COLUMN "name",
ALTER COLUMN "supportingServiceActivityTypeId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "SupportingServiceActivity" ADD CONSTRAINT "SupportingServiceActivity_supportingServiceActivityTypeId_fkey" FOREIGN KEY ("supportingServiceActivityTypeId") REFERENCES "SupportingServiceActivityType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "externalFirstName" TEXT,
ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "externalLastName" TEXT,
ADD COLUMN     "externalName" TEXT;
