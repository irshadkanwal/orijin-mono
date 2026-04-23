-- CreateTable
CREATE TABLE "ServiceActivityLocation" (
    "id" TEXT NOT NULL,
    "supportingServiceActivityId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,

    CONSTRAINT "ServiceActivityLocation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ServiceActivityLocation" ADD CONSTRAINT "ServiceActivityLocation_supportingServiceActivityId_fkey" FOREIGN KEY ("supportingServiceActivityId") REFERENCES "SupportingServiceActivity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceActivityLocation" ADD CONSTRAINT "ServiceActivityLocation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
