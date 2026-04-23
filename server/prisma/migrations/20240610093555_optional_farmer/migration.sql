-- DropForeignKey
ALTER TABLE "SurveyResult" DROP CONSTRAINT "SurveyResult_farmId_fkey";

-- AlterTable
ALTER TABLE "SurveyResult" ALTER COLUMN "farmId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "SurveyResult" ADD CONSTRAINT "SurveyResult_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE SET NULL ON UPDATE CASCADE;
