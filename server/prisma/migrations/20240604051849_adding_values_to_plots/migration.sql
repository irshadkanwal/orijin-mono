-- AlterTable
ALTER TABLE "Plot" ADD COLUMN     "distanceToForest" INTEGER,
ADD COLUMN     "distanceToForestKnown" BOOLEAN,
ADD COLUMN     "establishedBefore2020" BOOLEAN,
ADD COLUMN     "hasLandTitle" BOOLEAN,
ADD COLUMN     "hasRightToLand" BOOLEAN,
ADD COLUMN     "hasShadeTrees" BOOLEAN,
ADD COLUMN     "ownerName" TEXT,
ADD COLUMN     "principalLeasesLand" BOOLEAN,
ADD COLUMN     "principalOwnsLand" BOOLEAN,
ADD COLUMN     "traditionalOwnersPresent" BOOLEAN;
