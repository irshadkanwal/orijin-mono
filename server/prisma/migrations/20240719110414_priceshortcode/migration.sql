/*
  Warnings:

  - A unique constraint covering the columns `[shortCode]` on the table `Price` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Price" ADD COLUMN     "shortCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Price_shortCode_key" ON "Price"("shortCode");
