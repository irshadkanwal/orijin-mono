/*
  Warnings:

  - You are about to drop the column `answer_options` on the `SurveyQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `answer_type` on the `SurveyQuestion` table. All the data in the column will be lost.
  - Added the required column `answerOptions` to the `SurveyQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `answerType` to the `SurveyQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SurveyQuestion" DROP COLUMN "answer_options",
DROP COLUMN "answer_type",
ADD COLUMN     "answerOptions" JSONB NOT NULL,
ADD COLUMN     "answerType" TEXT NOT NULL;
