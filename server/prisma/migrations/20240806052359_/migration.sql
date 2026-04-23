-- CreateTable
CREATE TABLE "PolygonWarning" (
    "id" TEXT NOT NULL,
    "polygonId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "fixed" BOOLEAN NOT NULL,

    CONSTRAINT "PolygonWarning_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PolygonWarning" ADD CONSTRAINT "PolygonWarning_polygonId_fkey" FOREIGN KEY ("polygonId") REFERENCES "Polygon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;