/*
  Warnings:

  - Added the required column `dateOfService` to the `SupportingServiceActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `operator` to the `SupportingServiceActivity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SupportingServiceActivity" ADD COLUMN     "dateOfService" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "operator" TEXT NOT NULL;
