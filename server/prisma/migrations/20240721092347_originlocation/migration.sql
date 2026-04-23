/*
  Warnings:

  - You are about to drop the `_LocationToProduct` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `originLocationId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_LocationToProduct" DROP CONSTRAINT "_LocationToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_LocationToProduct" DROP CONSTRAINT "_LocationToProduct_B_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "originLocationId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_LocationToProduct";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_originLocationId_fkey" FOREIGN KEY ("originLocationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
