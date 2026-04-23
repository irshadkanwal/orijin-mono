/*
  Warnings:

  - You are about to drop the column `organisationId` on the `ActivityLog` table. All the data in the column will be lost.
  - You are about to drop the column `organisationId` on the `Certification` table. All the data in the column will be lost.
  - You are about to drop the column `organisationId` on the `CertificationType` table. All the data in the column will be lost.
  - You are about to drop the column `organisationId` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `organisationId` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `organisationId` on the `CountItem` table. All the data in the column will be lost.
  - You are about to drop the column `organisationId` on the `Crop` table. All the data in the column will be lost.
  - You are about to drop the column `organisationId` on the `Facility` table. All the data in the column will be lost.
  - You are about to drop the column `organisationId` on the `Farm` table. All the data in the column will be lost.
  - You are about to drop the column `organisationId` on the `Farmer` table. All the data in the column will be lost.
  - You are about to drop the column `organisationId` on the `GeoCoordinate` table. All the data in the column will be lost.
  - You are about to drop the column `organisationId` on the `GeoPolygon` table. All the data in the column will be lost.
  - You are about to drop the column `organisationId` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `organisationId` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `organisationId` on the `Plot` table. All the data in the column will be lost.
  - You are about to drop the column `organisationId` on the `Price` table. All the data in the column will be lost.
  - You are about to drop the column `organisationId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `organisationId` on the `ProductType` table. All the data in the column will be lost.
  - You are about to drop the column `organisationId` on the `Season` table. All the data in the column will be lost.
  - You are about to drop the column `organisationId` on the `SupportingServiceActivity` table. All the data in the column will be lost.
  - You are about to drop the column `organisationId` on the `SupportingServiceCategory` table. All the data in the column will be lost.
  - You are about to drop the column `organisationId` on the `SupportingServiceCategoryType` table. All the data in the column will be lost.
  - You are about to drop the column `organisationId` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the column `organisationId` on the `Variety` table. All the data in the column will be lost.
  - You are about to drop the column `organisationId` on the `Wallet` table. All the data in the column will be lost.
  - Added the required column `organisation` to the `ActivityLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organisation` to the `Certification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organisation` to the `CertificationType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organisation` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organisation` to the `Contract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organisation` to the `CountItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organisation` to the `Crop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organisation` to the `Facility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organisation` to the `Farm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organisation` to the `Farmer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organisation` to the `GeoCoordinate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organisation` to the `GeoPolygon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organisation` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organisation` to the `Person` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organisation` to the `Plot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organisation` to the `Price` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organisation` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organisation` to the `ProductType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organisation` to the `Season` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organisation` to the `SupportingServiceActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organisation` to the `SupportingServiceCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organisation` to the `SupportingServiceCategoryType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organisation` to the `Tag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organisation` to the `Variety` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organisation` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ActivityLog" DROP COLUMN "organisationId",
ADD COLUMN     "organisation" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Certification" DROP COLUMN "organisationId",
ADD COLUMN     "organisation" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CertificationType" DROP COLUMN "organisationId",
ADD COLUMN     "organisation" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "organisationId",
ADD COLUMN     "organisation" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "organisationId",
ADD COLUMN     "organisation" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CountItem" DROP COLUMN "organisationId",
ADD COLUMN     "organisation" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Crop" DROP COLUMN "organisationId",
ADD COLUMN     "organisation" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Facility" DROP COLUMN "organisationId",
ADD COLUMN     "organisation" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Farm" DROP COLUMN "organisationId",
ADD COLUMN     "organisation" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Farmer" DROP COLUMN "organisationId",
ADD COLUMN     "organisation" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GeoCoordinate" DROP COLUMN "organisationId",
ADD COLUMN     "organisation" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GeoPolygon" DROP COLUMN "organisationId",
ADD COLUMN     "organisation" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "organisationId",
ADD COLUMN     "organisation" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Person" DROP COLUMN "organisationId",
ADD COLUMN     "organisation" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Plot" DROP COLUMN "organisationId",
ADD COLUMN     "organisation" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Price" DROP COLUMN "organisationId",
ADD COLUMN     "organisation" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "organisationId",
ADD COLUMN     "organisation" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProductType" DROP COLUMN "organisationId",
ADD COLUMN     "organisation" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Season" DROP COLUMN "organisationId",
ADD COLUMN     "organisation" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SupportingServiceActivity" DROP COLUMN "organisationId",
ADD COLUMN     "organisation" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SupportingServiceCategory" DROP COLUMN "organisationId",
ADD COLUMN     "organisation" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SupportingServiceCategoryType" DROP COLUMN "organisationId",
ADD COLUMN     "organisation" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "organisationId",
ADD COLUMN     "organisation" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Variety" DROP COLUMN "organisationId",
ADD COLUMN     "organisation" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "organisationId",
ADD COLUMN     "organisation" TEXT NOT NULL;
