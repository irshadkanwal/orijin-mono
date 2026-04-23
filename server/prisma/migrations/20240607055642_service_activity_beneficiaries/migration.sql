-- CreateTable
CREATE TABLE "ServiceActivityBeneficiaries" (
    "id" TEXT NOT NULL,
    "supportingServiceActivityId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,

    CONSTRAINT "ServiceActivityBeneficiaries_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ServiceActivityBeneficiaries" ADD CONSTRAINT "ServiceActivityBeneficiaries_supportingServiceActivityId_fkey" FOREIGN KEY ("supportingServiceActivityId") REFERENCES "SupportingServiceActivity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceActivityBeneficiaries" ADD CONSTRAINT "ServiceActivityBeneficiaries_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
