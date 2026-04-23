/*
  Warnings:

  - You are about to drop the column `timeOfCalculation` on the `ScoringResult` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Rule` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `functionType` to the `Rule` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FunctionTypes" AS ENUM ('CUSTOM', 'FARMAREAVALIDATOR');

-- AlterTable
ALTER TABLE "Rule" ADD COLUMN     "functionType" "FunctionTypes" NOT NULL,
ALTER COLUMN "functionCode" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ScoringResult" DROP COLUMN "timeOfCalculation",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Rule_name_key" ON "Rule"("name");
