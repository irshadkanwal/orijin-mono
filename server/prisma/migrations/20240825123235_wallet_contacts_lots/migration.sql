-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "primary" BOOLEAN,
ADD COLUMN     "registeredForMobileMoney" BOOLEAN,
ADD COLUMN     "registeredUnderPrincipalsName" BOOLEAN;

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "approvalId" TEXT;

-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "errorMsg" TEXT,
ADD COLUMN     "errorStatus" TEXT,
ADD COLUMN     "externalSystemName" TEXT,
ADD COLUMN     "externalUuid" TEXT,
ADD COLUMN     "name_matches_network_score" DECIMAL(65,30),
ADD COLUMN     "name_matches_network_status" TEXT,
ADD COLUMN     "name_on_network" TEXT;

-- CreateTable
CREATE TABLE "Lot" (
    "id" TEXT NOT NULL,
    "idCode" TEXT,
    "organisation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "chainLabel" TEXT NOT NULL,
    "chainId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "systemStatus" TEXT NOT NULL,
    "containerId" TEXT,
    "accumulationType" TEXT NOT NULL,
    "originType" TEXT[],
    "type" TEXT[],
    "isBackDating" BOOLEAN NOT NULL,
    "purchaseStatus" TEXT,
    "paymentStatus" TEXT,
    "transportStatus" TEXT,
    "modificationStatus" TEXT,
    "reportStatus" TEXT,
    "approvalStatus" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "weight" DECIMAL(65,30) NOT NULL,
    "weightUnit" TEXT NOT NULL,
    "sackCount" INTEGER NOT NULL,
    "properties" JSONB NOT NULL,
    "seasonId" TEXT NOT NULL,
    "parentlotId" TEXT,

    CONSTRAINT "Lot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivitySubmit" (
    "id" TEXT NOT NULL,
    "organisation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "rawData" JSONB,
    "lotId" TEXT NOT NULL,
    "processingPropertiesId" TEXT,

    CONSTRAINT "ActivitySubmit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Approval" (
    "id" TEXT NOT NULL,
    "organisation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "type" TEXT NOT NULL,
    "status" TEXT,
    "note" TEXT,
    "userId" TEXT NOT NULL,
    "lotId" TEXT,
    "activitySubmitId" TEXT,

    CONSTRAINT "Approval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentTransaction" (
    "id" TEXT NOT NULL,
    "organisation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "externalStatus" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "accountId" TEXT,
    "payeeFirstName" TEXT NOT NULL,
    "payeeLastName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "weight" DECIMAL(65,30) NOT NULL,
    "weightUnit" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL,
    "conversionToUSD" DECIMAL(65,30) NOT NULL,
    "lotId" TEXT NOT NULL,
    "farmId" TEXT,
    "personId" TEXT,
    "walletId" TEXT,
    "errorMsg" TEXT,

    CONSTRAINT "PaymentTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lot_idCode_key" ON "Lot"("idCode");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentTransaction_lotId_key" ON "PaymentTransaction"("lotId");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_approvalId_fkey" FOREIGN KEY ("approvalId") REFERENCES "Approval"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lot" ADD CONSTRAINT "Lot_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lot" ADD CONSTRAINT "Lot_parentlotId_fkey" FOREIGN KEY ("parentlotId") REFERENCES "Lot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivitySubmit" ADD CONSTRAINT "ActivitySubmit_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivitySubmit" ADD CONSTRAINT "ActivitySubmit_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "Lot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "Lot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_activitySubmitId_fkey" FOREIGN KEY ("activitySubmitId") REFERENCES "ActivitySubmit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "Lot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
