-- CreateTable
CREATE TABLE "ScoringResult" (
    "id" TEXT NOT NULL,
    "timeOfCalculation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "batchId" TEXT NOT NULL,
    "ruleName" TEXT NOT NULL,
    "inputValue" JSONB,
    "scoreValue" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ScoringResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rule" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "functionCode" TEXT NOT NULL,
    "commonThreshold" INTEGER NOT NULL,
    "countryAdjustments" JSONB,

    CONSTRAINT "Rule_pkey" PRIMARY KEY ("id")
);
