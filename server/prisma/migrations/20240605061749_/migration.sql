/*
  Warnings:

  - Added the required column `organisation` to the `Survey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `SurveyQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Survey" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "organisation" TEXT NOT NULL,
ADD COLUMN     "shortCode" TEXT;

-- AlterTable
ALTER TABLE "SurveyQuestion" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
