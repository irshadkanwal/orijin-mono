-- CreateEnum
CREATE TYPE "EnumMainType" AS ENUM ('GLOBAL', 'CUSTOM');

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "mainType" "EnumMainType" NOT NULL DEFAULT 'GLOBAL';
