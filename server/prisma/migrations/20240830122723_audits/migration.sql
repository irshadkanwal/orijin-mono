-- DropForeignKey
ALTER TABLE "Certification" DROP CONSTRAINT "Certification_farmId_fkey";

-- AlterTable
ALTER TABLE "Certification" ADD COLUMN     "plotId" TEXT,
ALTER COLUMN "farmId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "CertificationType" ADD COLUMN     "auditActivityId" TEXT;

-- CreateTable
CREATE TABLE "AuditActivity" (
    "id" TEXT NOT NULL,
    "shortCode" TEXT,
    "organisation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "farmId" TEXT,

    CONSTRAINT "AuditActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditEntry" (
    "id" TEXT NOT NULL,
    "shortCode" TEXT,
    "organisation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL,
    "auditActivityId" TEXT NOT NULL,
    "targetNonComplianceId" TEXT,
    "targetFarmId" TEXT,
    "targetPlotId" TEXT,
    "targetSurveyId" TEXT,

    CONSTRAINT "AuditEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditNonCompliance" (
    "id" TEXT NOT NULL,
    "shortCode" TEXT,
    "organisation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "type" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "correctiveActionType" TEXT NOT NULL,
    "correctiveActionDescription" TEXT,
    "notes" TEXT,
    "correctiveActionDeadlineDate" TIMESTAMP(3),
    "followUpDate" TIMESTAMP(3),
    "targetFarmId" TEXT,
    "targetPlotId" TEXT,
    "auditActivityId" TEXT,

    CONSTRAINT "AuditNonCompliance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vessel" (
    "id" TEXT NOT NULL,
    "shortCode" TEXT,
    "organisation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "subType" TEXT NOT NULL,
    "description" TEXT,
    "permanent" BOOLEAN,
    "size" DECIMAL(65,30),
    "weight" DECIMAL(65,30),
    "facilityId" TEXT,
    "plotId" TEXT,

    CONSTRAINT "Vessel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AuditActivityToCertification" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AuditActivity_shortCode_organisation_key" ON "AuditActivity"("shortCode", "organisation");

-- CreateIndex
CREATE UNIQUE INDEX "AuditEntry_shortCode_organisation_key" ON "AuditEntry"("shortCode", "organisation");

-- CreateIndex
CREATE UNIQUE INDEX "AuditNonCompliance_shortCode_organisation_key" ON "AuditNonCompliance"("shortCode", "organisation");

-- CreateIndex
CREATE UNIQUE INDEX "Vessel_shortCode_organisation_key" ON "Vessel"("shortCode", "organisation");

-- CreateIndex
CREATE UNIQUE INDEX "_AuditActivityToCertification_AB_unique" ON "_AuditActivityToCertification"("A", "B");

-- CreateIndex
CREATE INDEX "_AuditActivityToCertification_B_index" ON "_AuditActivityToCertification"("B");

-- AddForeignKey
ALTER TABLE "CertificationType" ADD CONSTRAINT "CertificationType_auditActivityId_fkey" FOREIGN KEY ("auditActivityId") REFERENCES "AuditActivity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_plotId_fkey" FOREIGN KEY ("plotId") REFERENCES "Plot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditActivity" ADD CONSTRAINT "AuditActivity_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEntry" ADD CONSTRAINT "AuditEntry_auditActivityId_fkey" FOREIGN KEY ("auditActivityId") REFERENCES "AuditActivity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEntry" ADD CONSTRAINT "AuditEntry_targetNonComplianceId_fkey" FOREIGN KEY ("targetNonComplianceId") REFERENCES "AuditNonCompliance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEntry" ADD CONSTRAINT "AuditEntry_targetFarmId_fkey" FOREIGN KEY ("targetFarmId") REFERENCES "Farm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEntry" ADD CONSTRAINT "AuditEntry_targetPlotId_fkey" FOREIGN KEY ("targetPlotId") REFERENCES "Plot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEntry" ADD CONSTRAINT "AuditEntry_targetSurveyId_fkey" FOREIGN KEY ("targetSurveyId") REFERENCES "Survey"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditNonCompliance" ADD CONSTRAINT "AuditNonCompliance_targetFarmId_fkey" FOREIGN KEY ("targetFarmId") REFERENCES "Farm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditNonCompliance" ADD CONSTRAINT "AuditNonCompliance_targetPlotId_fkey" FOREIGN KEY ("targetPlotId") REFERENCES "Plot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditNonCompliance" ADD CONSTRAINT "AuditNonCompliance_auditActivityId_fkey" FOREIGN KEY ("auditActivityId") REFERENCES "AuditActivity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vessel" ADD CONSTRAINT "Vessel_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vessel" ADD CONSTRAINT "Vessel_plotId_fkey" FOREIGN KEY ("plotId") REFERENCES "Plot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuditActivityToCertification" ADD CONSTRAINT "_AuditActivityToCertification_A_fkey" FOREIGN KEY ("A") REFERENCES "AuditActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuditActivityToCertification" ADD CONSTRAINT "_AuditActivityToCertification_B_fkey" FOREIGN KEY ("B") REFERENCES "Certification"("id") ON DELETE CASCADE ON UPDATE CASCADE;
