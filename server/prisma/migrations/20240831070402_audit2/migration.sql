/*
  Warnings:

  - You are about to drop the column `auditActivityId` on the `CertificationType` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CertificationType" DROP CONSTRAINT "CertificationType_auditActivityId_fkey";

-- AlterTable
ALTER TABLE "CertificationType" DROP COLUMN "auditActivityId";

-- CreateTable
CREATE TABLE "_AuditActivityToCertificationType" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AuditActivityToCertificationType_AB_unique" ON "_AuditActivityToCertificationType"("A", "B");

-- CreateIndex
CREATE INDEX "_AuditActivityToCertificationType_B_index" ON "_AuditActivityToCertificationType"("B");

-- AddForeignKey
ALTER TABLE "_AuditActivityToCertificationType" ADD CONSTRAINT "_AuditActivityToCertificationType_A_fkey" FOREIGN KEY ("A") REFERENCES "AuditActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuditActivityToCertificationType" ADD CONSTRAINT "_AuditActivityToCertificationType_B_fkey" FOREIGN KEY ("B") REFERENCES "CertificationType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
