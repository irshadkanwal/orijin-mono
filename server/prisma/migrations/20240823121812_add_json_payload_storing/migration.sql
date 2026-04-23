-- AlterTable
ALTER TABLE "Plot" ALTER COLUMN "areaSizeManual" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "areaSizeOrganicManual" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "JsonPayload" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "organisation" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "farmId" TEXT,

    CONSTRAINT "JsonPayload_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JsonPayload" ADD CONSTRAINT "JsonPayload_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE SET NULL ON UPDATE CASCADE;
