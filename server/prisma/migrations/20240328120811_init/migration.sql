-- CreateTable
CREATE TABLE "Farmer" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Farmer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportingServiceCategoryType" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "shortCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "SupportingServiceCategoryType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportingServiceCategory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "supportingServiceCategoryTypeId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "shortCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "SupportingServiceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportingServiceActivity" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "farmerId" TEXT NOT NULL,
    "supportingServiceCategoryId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SupportingServiceActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Farmer_name_key" ON "Farmer"("name");

-- AddForeignKey
ALTER TABLE "SupportingServiceCategory" ADD CONSTRAINT "SupportingServiceCategory_supportingServiceCategoryTypeId_fkey" FOREIGN KEY ("supportingServiceCategoryTypeId") REFERENCES "SupportingServiceCategoryType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportingServiceActivity" ADD CONSTRAINT "SupportingServiceActivity_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportingServiceActivity" ADD CONSTRAINT "SupportingServiceActivity_supportingServiceCategoryId_fkey" FOREIGN KEY ("supportingServiceCategoryId") REFERENCES "SupportingServiceCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
