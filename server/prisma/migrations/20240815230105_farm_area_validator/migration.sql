/*
  Warnings:

  - The values [FARM_AREA_VALIDATOR] on the enum `FunctionTypes` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FunctionTypes_new" AS ENUM ('CUSTOM', 'FARM_AREA_VALIDATOR');
ALTER TABLE "Rule" ALTER COLUMN "functionType" TYPE "FunctionTypes_new" USING ("functionType"::text::"FunctionTypes_new");
ALTER TYPE "FunctionTypes" RENAME TO "FunctionTypes_old";
ALTER TYPE "FunctionTypes_new" RENAME TO "FunctionTypes";
DROP TYPE "FunctionTypes_old";
COMMIT;
