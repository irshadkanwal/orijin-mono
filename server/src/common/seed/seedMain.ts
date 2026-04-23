import { PrismaClient } from '@prisma/client';
import { seedVarieties } from './seedVarieties';
import { seedUsers } from './seedUsers';
import { FarmsService } from '../../farms/farms.service';
import { seedFarms } from './seedFarms';
import { seedLocations } from './seedLocations';
import { seedServices } from './seedServices';
import { seedSurvey } from './seedSurvey';
import { seedSeasons } from './seedSeasons';
import { seedProducts } from './seedProducts';
import { FirestoreFarmInspectionService } from '../../firestore/firestore.farm.inspection.service';
import { seedCertificationTypes } from './seedCertificationTypes';
import { seedVessels } from './seedVessels';
import { seedFacilities } from './seedFacilities';

const prisma = new PrismaClient();

export async function mainSeed(
  farmsService: FarmsService,
  farmInspectionService: FirestoreFarmInspectionService,
) {
  await emptyDatabase(prisma);
  const { user2 } = await seedUsers(prisma);
  await seedOneOrganisation('seed', farmsService, farmInspectionService, user2);
  console.log('Seed done!');
}

const seedOneOrganisation = async (
  organisation: string,
  farmsService: FarmsService,
  farmInspectionService: FirestoreFarmInspectionService,
  user,
) => {
  // Only for local devel purposes! Uncomment and run locally as needed - live DB won't need any seeds
  await seedSeasons(prisma, organisation);
  const varieties = await seedVarieties(prisma, organisation);
  const locations = await seedLocations(prisma, organisation);
  const certificationtypes = await seedCertificationTypes(prisma, organisation);
  await seedProducts(varieties, prisma, organisation, locations.global);
  await seedFarms(
    farmsService,
    farmInspectionService,
    locations.global,
    locations.custom,
    certificationtypes,
    prisma,
    organisation,
  );
  await seedServices(prisma, locations.global, organisation);
  await seedSurvey(prisma, user, farmsService, organisation);
  await seedVessels(prisma, organisation)
  await seedFacilities(organisation)
};

/**
 * Note! Must be done in an order that doesn't break foreign key constraints, so delete from the bottom up
 */
export const emptyDatabase = async (prismaService: PrismaClient) => {
  await prismaService.change.deleteMany();
  await prismaService.surveyAnswer.deleteMany();
  await prismaService.surveyResult.deleteMany();
  await prismaService.surveyQuestion.deleteMany();
  await prismaService.survey.deleteMany();
  await prismaService.certification.deleteMany();
  await prismaService.satelliteAnalysis.deleteMany();
  await prismaService.polygonInteractionWarning.deleteMany();
  await prismaService.polygonWarning.deleteMany();
  await prismaService.polygon.deleteMany();
  await prismaService.plot.deleteMany();
  await prismaService.farm.deleteMany();
  await prismaService.facility.deleteMany();
  await prismaService.season.deleteMany();
  await prismaService.price.deleteMany();
  await prismaService.product.deleteMany();
  await prismaService.productType.deleteMany();
  await prismaService.cropVariety.deleteMany();
  await prismaService.serviceActivityBeneficiaries.deleteMany();
  await prismaService.serviceActivityLocation.deleteMany();
  await prismaService.supportingServiceActivity.deleteMany();
  await prismaService.supportingServiceInputType.deleteMany();
  await prismaService.supportingServiceActivityType.deleteMany();
  await prismaService.supportingServiceCategory.deleteMany();
  await prismaService.supportingServiceCategoryType.deleteMany();
  await prismaService.wallet.deleteMany();
  await prismaService.contact.deleteMany();
  await prismaService.certificationType.deleteMany();
  await prismaService.person.deleteMany();
  await prismaService.crop.deleteMany();
  await prismaService.location.deleteMany();
  await prismaService.rule.deleteMany();
  await prismaService.scoringResult.deleteMany();
  await prismaService.jsonPayload.deleteMany();
  await prismaService.vessel.deleteMany();
};
