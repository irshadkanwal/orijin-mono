-- CreateTable
CREATE TABLE "Change" (
    "id" TEXT NOT NULL,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "transaction" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "objectId" TEXT NOT NULL,
    "objectType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,

    CONSTRAINT "Change_pkey" PRIMARY KEY ("id")
);
