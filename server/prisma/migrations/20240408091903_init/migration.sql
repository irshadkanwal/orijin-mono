/*
  Warnings:

  - A unique constraint covering the columns `[shortCode]` on the table `Farmer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shortCode]` on the table `SupportingServiceActivity` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shortCode]` on the table `SupportingServiceCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shortCode]` on the table `SupportingServiceCategoryType` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organisationId` to the `Farmer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organisationId` to the `SupportingServiceActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organisationId` to the `SupportingServiceCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organisationId` to the `SupportingServiceCategoryType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Farmer" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "shortCode" TEXT,
ADD COLUMN     "organisationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SupportingServiceActivity" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "shortCode" TEXT,
ADD COLUMN     "organisationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SupportingServiceCategory" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "organisationId" TEXT NOT NULL,
ALTER COLUMN "shortCode" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SupportingServiceCategoryType" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "organisationId" TEXT NOT NULL,
ALTER COLUMN "shortCode" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "name" TEXT;

-- CreateTable
CREATE TABLE "Organisation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,

    CONSTRAINT "Organisation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "organisationId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "activityType" TEXT NOT NULL,
    "activityName" TEXT,
    "note" TEXT NOT NULL,
    "dataPreview" JSONB NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Season" (
    "id" TEXT NOT NULL,
    "shortCode" TEXT,
    "organisationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "shortCode" TEXT,
    "organisationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Crop" (
    "id" TEXT NOT NULL,
    "shortCode" TEXT,
    "organisationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,

    CONSTRAINT "Crop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Variety" (
    "id" TEXT NOT NULL,
    "shortCode" TEXT,
    "organisationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "cropId" TEXT NOT NULL,

    CONSTRAINT "Variety_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CertificationType" (
    "id" TEXT NOT NULL,
    "shortCode" TEXT,
    "organisationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,

    CONSTRAINT "CertificationType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeoCoordinate" (
    "id" TEXT NOT NULL,
    "shortCode" TEXT,
    "organisationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "point" point,
    "name" TEXT,
    "altitude" DECIMAL(65,30),
    "accuracy" DECIMAL(65,30),
    "altitudeAccuracy" DECIMAL(65,30),
    "speed" DECIMAL(65,30),
    "altitudeMin" DECIMAL(65,30),
    "altitudeMax" DECIMAL(65,30),

    CONSTRAINT "GeoCoordinate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "shortCode" TEXT,
    "organisationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "coordinateId" TEXT,
    "parentId" TEXT,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductType" (
    "id" TEXT NOT NULL,
    "shortCode" TEXT,
    "organisationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "cropId" TEXT,

    CONSTRAINT "ProductType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "shortCode" TEXT,
    "organisationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "sku" TEXT,
    "description" TEXT,
    "organic" BOOLEAN,
    "singleOrigin" BOOLEAN,
    "productTypeId" TEXT NOT NULL,
    "grade" INTEGER,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Price" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "unit" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "perAmountUnit" DECIMAL(65,30) NOT NULL,
    "perAmountAmount" DECIMAL(65,30) NOT NULL,
    "active" BOOLEAN DEFAULT true,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "productId" TEXT NOT NULL,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "shortCode" TEXT,
    "organisationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "phone2" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gender" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "dateOfBirthApproximate" BOOLEAN,
    "nickName" TEXT,
    "identificationNumber" TEXT,
    "identificationNumberType" TEXT,
    "education" TEXT,
    "maritalStatus" TEXT,
    "customFields" JSONB,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "shortCode" TEXT,
    "organisationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "type" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "personId" TEXT NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "shortCode" TEXT,
    "organisationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "type" TEXT NOT NULL,
    "phone" TEXT,
    "contactId" TEXT NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeoPolygon" (
    "id" TEXT NOT NULL,
    "shortCode" TEXT,
    "organisationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL,
    "status" TEXT,
    "areaCalculated" DECIMAL(65,30),
    "areaManual" DECIMAL(65,30),
    "polygon" polygon,
    "polygonRaw" polygon,
    "polygonMinimized" polygon,
    "plotId" TEXT NOT NULL,

    CONSTRAINT "GeoPolygon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facility" (
    "id" TEXT NOT NULL,
    "shortCode" TEXT,
    "organisationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "areaTotalManual" DECIMAL(65,30),
    "address" JSONB,
    "coordinateId" TEXT,
    "mainContactPersonId" TEXT,
    "locationId" TEXT,
    "timezone" TEXT,

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL,
    "shortCode" TEXT,
    "organisationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3),
    "certificationTypeId" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,

    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Farm" (
    "id" TEXT NOT NULL,
    "shortCode" TEXT,
    "organisationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "facilityId" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "approvalStatus" TEXT,
    "creationStatus" TEXT,
    "houseHoldCoordinateId" TEXT,
    "cultivationStartDate" TIMESTAMP(3),
    "contractDate" TIMESTAMP(3),
    "registrationDate" TIMESTAMP(3),
    "certificationStartDate" TIMESTAMP(3),
    "lastChemicalUseDate" TIMESTAMP(3),
    "lastInspectionDate" TIMESTAMP(3),
    "firstVisitDate" TIMESTAMP(3),

    CONSTRAINT "Farm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CountItem" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "category" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "subType" TEXT,
    "count" INTEGER NOT NULL,
    "plotId" TEXT,
    "farmId" TEXT,

    CONSTRAINT "CountItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plot" (
    "id" TEXT NOT NULL,
    "shortCode" TEXT,
    "organisationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "certificationStatus" TEXT,
    "interCropped" BOOLEAN,
    "active" BOOLEAN,
    "yieldEstimateRaw" INTEGER,
    "yieldEstimateProcessed" INTEGER,
    "cultivationStartDate" TIMESTAMP(3),
    "registrationDate" TIMESTAMP(3),
    "lastChemicalUseDate" TIMESTAMP(3),
    "areaSizeManual" INTEGER,

    CONSTRAINT "Plot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "shortCode" TEXT,
    "organisationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3),
    "farmId" TEXT NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CropToPlot" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CertificationTypeToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_LocationToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_LocationToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductToVariety" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FacilityToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FacilityToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FarmToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PlotToVariety" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Season_shortCode_key" ON "Season"("shortCode");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_shortCode_key" ON "Tag"("shortCode");

-- CreateIndex
CREATE UNIQUE INDEX "Crop_shortCode_key" ON "Crop"("shortCode");

-- CreateIndex
CREATE UNIQUE INDEX "Variety_shortCode_key" ON "Variety"("shortCode");

-- CreateIndex
CREATE UNIQUE INDEX "CertificationType_shortCode_key" ON "CertificationType"("shortCode");

-- CreateIndex
CREATE UNIQUE INDEX "GeoCoordinate_shortCode_key" ON "GeoCoordinate"("shortCode");

-- CreateIndex
CREATE UNIQUE INDEX "Location_shortCode_key" ON "Location"("shortCode");

-- CreateIndex
CREATE UNIQUE INDEX "Location_parentId_key" ON "Location"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductType_shortCode_key" ON "ProductType"("shortCode");

-- CreateIndex
CREATE UNIQUE INDEX "Product_shortCode_key" ON "Product"("shortCode");

-- CreateIndex
CREATE UNIQUE INDEX "Person_shortCode_key" ON "Person"("shortCode");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_shortCode_key" ON "Contact"("shortCode");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_shortCode_key" ON "Wallet"("shortCode");

-- CreateIndex
CREATE UNIQUE INDEX "GeoPolygon_shortCode_key" ON "GeoPolygon"("shortCode");

-- CreateIndex
CREATE UNIQUE INDEX "Facility_shortCode_key" ON "Facility"("shortCode");

-- CreateIndex
CREATE UNIQUE INDEX "Certification_shortCode_key" ON "Certification"("shortCode");

-- CreateIndex
CREATE UNIQUE INDEX "Farm_shortCode_key" ON "Farm"("shortCode");

-- CreateIndex
CREATE UNIQUE INDEX "Farm_facilityId_key" ON "Farm"("facilityId");

-- CreateIndex
CREATE UNIQUE INDEX "Farm_seasonId_key" ON "Farm"("seasonId");

-- CreateIndex
CREATE UNIQUE INDEX "Plot_shortCode_key" ON "Plot"("shortCode");

-- CreateIndex
CREATE UNIQUE INDEX "Plot_farmId_key" ON "Plot"("farmId");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_shortCode_key" ON "Contract"("shortCode");

-- CreateIndex
CREATE UNIQUE INDEX "_CropToPlot_AB_unique" ON "_CropToPlot"("A", "B");

-- CreateIndex
CREATE INDEX "_CropToPlot_B_index" ON "_CropToPlot"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CertificationTypeToProduct_AB_unique" ON "_CertificationTypeToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_CertificationTypeToProduct_B_index" ON "_CertificationTypeToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LocationToTag_AB_unique" ON "_LocationToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_LocationToTag_B_index" ON "_LocationToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LocationToProduct_AB_unique" ON "_LocationToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_LocationToProduct_B_index" ON "_LocationToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToVariety_AB_unique" ON "_ProductToVariety"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToVariety_B_index" ON "_ProductToVariety"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FacilityToTag_AB_unique" ON "_FacilityToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_FacilityToTag_B_index" ON "_FacilityToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FacilityToProduct_AB_unique" ON "_FacilityToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_FacilityToProduct_B_index" ON "_FacilityToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FarmToProduct_AB_unique" ON "_FarmToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_FarmToProduct_B_index" ON "_FarmToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PlotToVariety_AB_unique" ON "_PlotToVariety"("A", "B");

-- CreateIndex
CREATE INDEX "_PlotToVariety_B_index" ON "_PlotToVariety"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Farmer_shortCode_key" ON "Farmer"("shortCode");

-- CreateIndex
CREATE UNIQUE INDEX "SupportingServiceActivity_shortCode_key" ON "SupportingServiceActivity"("shortCode");

-- CreateIndex
CREATE UNIQUE INDEX "SupportingServiceCategory_shortCode_key" ON "SupportingServiceCategory"("shortCode");

-- CreateIndex
CREATE UNIQUE INDEX "SupportingServiceCategoryType_shortCode_key" ON "SupportingServiceCategoryType"("shortCode");

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variety" ADD CONSTRAINT "Variety_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "Crop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_coordinateId_fkey" FOREIGN KEY ("coordinateId") REFERENCES "GeoCoordinate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductType" ADD CONSTRAINT "ProductType_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "Crop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_productTypeId_fkey" FOREIGN KEY ("productTypeId") REFERENCES "ProductType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeoPolygon" ADD CONSTRAINT "GeoPolygon_plotId_fkey" FOREIGN KEY ("plotId") REFERENCES "Plot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facility" ADD CONSTRAINT "Facility_coordinateId_fkey" FOREIGN KEY ("coordinateId") REFERENCES "GeoCoordinate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facility" ADD CONSTRAINT "Facility_mainContactPersonId_fkey" FOREIGN KEY ("mainContactPersonId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facility" ADD CONSTRAINT "Facility_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_certificationTypeId_fkey" FOREIGN KEY ("certificationTypeId") REFERENCES "CertificationType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Farm" ADD CONSTRAINT "Farm_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Farm" ADD CONSTRAINT "Farm_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Farm" ADD CONSTRAINT "Farm_houseHoldCoordinateId_fkey" FOREIGN KEY ("houseHoldCoordinateId") REFERENCES "GeoCoordinate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountItem" ADD CONSTRAINT "CountItem_plotId_fkey" FOREIGN KEY ("plotId") REFERENCES "Plot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountItem" ADD CONSTRAINT "CountItem_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plot" ADD CONSTRAINT "Plot_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CropToPlot" ADD CONSTRAINT "_CropToPlot_A_fkey" FOREIGN KEY ("A") REFERENCES "Crop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CropToPlot" ADD CONSTRAINT "_CropToPlot_B_fkey" FOREIGN KEY ("B") REFERENCES "Plot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificationTypeToProduct" ADD CONSTRAINT "_CertificationTypeToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "CertificationType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificationTypeToProduct" ADD CONSTRAINT "_CertificationTypeToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LocationToTag" ADD CONSTRAINT "_LocationToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LocationToTag" ADD CONSTRAINT "_LocationToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LocationToProduct" ADD CONSTRAINT "_LocationToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LocationToProduct" ADD CONSTRAINT "_LocationToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToVariety" ADD CONSTRAINT "_ProductToVariety_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToVariety" ADD CONSTRAINT "_ProductToVariety_B_fkey" FOREIGN KEY ("B") REFERENCES "Variety"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FacilityToTag" ADD CONSTRAINT "_FacilityToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FacilityToTag" ADD CONSTRAINT "_FacilityToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FacilityToProduct" ADD CONSTRAINT "_FacilityToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FacilityToProduct" ADD CONSTRAINT "_FacilityToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FarmToProduct" ADD CONSTRAINT "_FarmToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FarmToProduct" ADD CONSTRAINT "_FarmToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlotToVariety" ADD CONSTRAINT "_PlotToVariety_A_fkey" FOREIGN KEY ("A") REFERENCES "Plot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlotToVariety" ADD CONSTRAINT "_PlotToVariety_B_fkey" FOREIGN KEY ("B") REFERENCES "Variety"("id") ON DELETE CASCADE ON UPDATE CASCADE;
