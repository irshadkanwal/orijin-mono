-- CreateTable
CREATE TABLE "PolygonInteractionWarning" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "polygonIdA" TEXT NOT NULL,
    "polygonIdB" TEXT NOT NULL,
    "fixed" BOOLEAN NOT NULL,

    CONSTRAINT "PolygonInteractionWarning_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PolygonInteractionWarning" ADD CONSTRAINT "PolygonInteractionWarning_polygonIdA_fkey" FOREIGN KEY ("polygonIdA") REFERENCES "Polygon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PolygonInteractionWarning" ADD CONSTRAINT "PolygonInteractionWarning_polygonIdB_fkey" FOREIGN KEY ("polygonIdB") REFERENCES "Polygon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
