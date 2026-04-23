-- CreateEnum
CREATE TYPE "BeneficiaryType" AS ENUM ('INDIVIDUAL', 'GROUP');

-- AlterTable
ALTER TABLE "SupportingServiceActivityType" ADD COLUMN     "beneficiaryType" "BeneficiaryType" NOT NULL DEFAULT 'INDIVIDUAL';
