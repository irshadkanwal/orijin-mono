/*
  Warnings:

  - You are about to drop the column `shortCode` on the `Farm` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Person` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Farm_shortCode_key";

-- AlterTable
ALTER TABLE "Farm" DROP COLUMN "shortCode";

-- AlterTable
ALTER TABLE "Person" DROP COLUMN "name";
