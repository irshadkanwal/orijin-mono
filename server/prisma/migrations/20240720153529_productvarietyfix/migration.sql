/*
  Warnings:

  - You are about to drop the `_CropVarietyToProduct` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `originVarietyId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SupportingServiceActivity" DROP CONSTRAINT "SupportingServiceActivity_locationId_fkey";

-- DropForeignKey
ALTER TABLE "_CropVarietyToProduct" DROP CONSTRAINT "_CropVarietyToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_CropVarietyToProduct" DROP CONSTRAINT "_CropVarietyToProduct_B_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "originVarietyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SupportingServiceActivity" ALTER COLUMN "locationId" DROP NOT NULL;

-- DropTable
DROP TABLE "_CropVarietyToProduct";

-- AddForeignKey
ALTER TABLE "SupportingServiceActivity" ADD CONSTRAINT "SupportingServiceActivity_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_originVarietyId_fkey" FOREIGN KEY ("originVarietyId") REFERENCES "CropVariety"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
