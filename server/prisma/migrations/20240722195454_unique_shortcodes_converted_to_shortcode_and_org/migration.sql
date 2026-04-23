/*
  Warnings:

  - A unique constraint covering the columns `[shortCode,organisation]` on the table `Certification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shortCode,organisation]` on the table `CertificationType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shortCode,organisation]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shortCode,organisation]` on the table `Contract` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shortCode,organisation]` on the table `Crop` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shortCode,organisation]` on the table `CropVariety` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shortCode,organisation]` on the table `Facility` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shortCode,organisation]` on the table `Farmer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shortCode,organisation,type]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shortCode,organisation]` on the table `Person` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shortCode,organisation]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shortCode,organisation]` on the table `ProductType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shortCode,organisation]` on the table `Season` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shortCode,organisation]` on the table `SupportingServiceActivity` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shortCode,organisation]` on the table `SupportingServiceCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shortCode,organisation]` on the table `SupportingServiceCategoryType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shortCode,organisation]` on the table `Survey` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shortCode,organisation]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shortCode,organisation]` on the table `Wallet` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Certification_shortCode_key";

-- DropIndex
DROP INDEX "CertificationType_shortCode_key";

-- DropIndex
DROP INDEX "Contact_shortCode_key";

-- DropIndex
DROP INDEX "Contract_shortCode_key";

-- DropIndex
DROP INDEX "Crop_shortCode_key";

-- DropIndex
DROP INDEX "CropVariety_shortCode_key";

-- DropIndex
DROP INDEX "Facility_shortCode_key";

-- DropIndex
DROP INDEX "Farmer_shortCode_key";

-- DropIndex
DROP INDEX "Person_shortCode_key";

-- DropIndex
DROP INDEX "Price_shortCode_key";

-- DropIndex
DROP INDEX "Product_shortCode_key";

-- DropIndex
DROP INDEX "ProductType_shortCode_key";

-- DropIndex
DROP INDEX "Season_shortCode_key";

-- DropIndex
DROP INDEX "SupportingServiceActivity_shortCode_key";

-- DropIndex
DROP INDEX "SupportingServiceCategory_shortCode_key";

-- DropIndex
DROP INDEX "SupportingServiceCategoryType_shortCode_key";

-- DropIndex
DROP INDEX "Tag_shortCode_key";

-- DropIndex
DROP INDEX "Wallet_shortCode_key";

-- CreateIndex
CREATE UNIQUE INDEX "Certification_shortCode_organisation_key" ON "Certification"("shortCode", "organisation");

-- CreateIndex
CREATE UNIQUE INDEX "CertificationType_shortCode_organisation_key" ON "CertificationType"("shortCode", "organisation");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_shortCode_organisation_key" ON "Contact"("shortCode", "organisation");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_shortCode_organisation_key" ON "Contract"("shortCode", "organisation");

-- CreateIndex
CREATE UNIQUE INDEX "Crop_shortCode_organisation_key" ON "Crop"("shortCode", "organisation");

-- CreateIndex
CREATE UNIQUE INDEX "CropVariety_shortCode_organisation_key" ON "CropVariety"("shortCode", "organisation");

-- CreateIndex
CREATE UNIQUE INDEX "Facility_shortCode_organisation_key" ON "Facility"("shortCode", "organisation");

-- CreateIndex
CREATE UNIQUE INDEX "Farmer_shortCode_organisation_key" ON "Farmer"("shortCode", "organisation");

-- CreateIndex
CREATE UNIQUE INDEX "Location_shortCode_organisation_type_key" ON "Location"("shortCode", "organisation", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Person_shortCode_organisation_key" ON "Person"("shortCode", "organisation");

-- CreateIndex
CREATE UNIQUE INDEX "Product_shortCode_organisation_key" ON "Product"("shortCode", "organisation");

-- CreateIndex
CREATE UNIQUE INDEX "ProductType_shortCode_organisation_key" ON "ProductType"("shortCode", "organisation");

-- CreateIndex
CREATE UNIQUE INDEX "Season_shortCode_organisation_key" ON "Season"("shortCode", "organisation");

-- CreateIndex
CREATE UNIQUE INDEX "SupportingServiceActivity_shortCode_organisation_key" ON "SupportingServiceActivity"("shortCode", "organisation");

-- CreateIndex
CREATE UNIQUE INDEX "SupportingServiceCategory_shortCode_organisation_key" ON "SupportingServiceCategory"("shortCode", "organisation");

-- CreateIndex
CREATE UNIQUE INDEX "SupportingServiceCategoryType_shortCode_organisation_key" ON "SupportingServiceCategoryType"("shortCode", "organisation");

-- CreateIndex
CREATE UNIQUE INDEX "Survey_shortCode_organisation_key" ON "Survey"("shortCode", "organisation");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_shortCode_organisation_key" ON "Tag"("shortCode", "organisation");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_shortCode_organisation_key" ON "Wallet"("shortCode", "organisation");
