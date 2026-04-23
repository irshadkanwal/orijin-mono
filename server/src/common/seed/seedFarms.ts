import { FarmsService } from '../../farms/farms.service';
import { FarmsDto } from '../../farms/dto/farms.dto';
import { Location } from '../../locations/models/locations.model';
import {
  generateOverlappingFarm,
  getExampleFarmInputs,
} from './seedData/exampleFarms';
import { PrismaClient, Season } from '@prisma/client';
import { GeocledianStatus } from '../../geocledian/geocledian.model';
import { Farm } from '../../farms/models/farms.model';
import { Chance } from 'chance';
import {
  PlotCoordinateSources,
  PlotType,
} from '../../farms/models/plots.model';
import { FacilityType } from '../../facilities/models/facility.model';
import { UserType } from '../../users/models/user.model';
import { generatePolygon } from './seedPolygons';
import { FirestoreFarmInspectionService } from '../../firestore/firestore.farm.inspection.service';
import {
  farmInspectionResultFromV1,
  farmInspectionResultFromV2,
} from './seedData/farmInspectionResult.json';
import { CertificationType } from '../../certifications/models/certifications.model';

const chance = new Chance();

const generateRandomPlots = (count: number) => {
  const plots = [];
  for (let i = 0; i < count; i++) {
    plots.push({
      shortCode: 'PLOT-' + chance.guid(),
      name: chance.word({ length: 5 }),
      type: chance.pickone([PlotType.Permanent]),
      polygonCoordinates: generatePolygon(
        { lat: 30.111, long: 0.6111 },
        0.1,
        0.004,
      ),
      polygonSource: PlotCoordinateSources.IMPORT,
    });
  }
  return plots;
};
const generateOffsetFromVertex = (coordinates: number[][]) => {
  const vertexIndex = Math.floor(Math.random() * coordinates.length); // Select a random vertex
  const vertex = coordinates[vertexIndex];
  const maxDistance = 0.003; // Max distance to offset from the vertex
  const angle = Math.random() * 2 * Math.PI; // Random angle
  const distance = Math.random() * maxDistance; // Random distance up to maxDistance
  return {
    latitude: vertex[0] + distance * Math.sin(angle),
    longitude: vertex[1] + distance * Math.cos(angle),
  };
};

const generateRandomFarm = (
  index: number,
  organisation: string,
  location: Location,
  seasonCode?: string,
): FarmsDto => {
  const name = chance.name();
  const plots = generateRandomPlots(chance.integer({ min: 1, max: 5 }));
  const firstPlot = plots[0];
  const farmHouseLocation = generateOffsetFromVertex(
    firstPlot.polygonCoordinates,
  );
  return {
    organisation,
    facilityValues: {
      organisation,
      shortCode: 'RANDO-' + String(index).padStart(3, '0'),
      name: name,
      type: FacilityType.Farm,
      areaTotalManual: chance.floating({ min: 1, max: 10, fixed: 2 }),
      location: location,
      coordinate: farmHouseLocation,
      mainContactPerson: {
        shortCode: 'RANDO-' + index,
        organisation,
        type: UserType.Farmer,
        email: chance.email(),
        phone: chance.phone(),
        firstName: name.split(' ')[0],
        lastName: name.split(' ')[1],
        gender: chance.gender(),
        dateOfBirth: chance.birthday(),
        dateOfBirthApproximate: false,
        identificationNumberType: 'NationalId',
        identificationNumber: chance
          .natural({ min: 1000000000, max: 9999999999 })
          .toString(),
        education: chance.pickone(['Primary', 'Secondary', 'Tertiary', 'None']),
        maritalStatus: chance.pickone([
          'Single',
          'Married',
          'Divorced',
          'Widowed',
        ]),
      },
    },
    farmValues: {
      seasonCode,
      plots: plots,
    },
  };
};

const addSatelliteForFarmOne = async (farmOne, prisma) => {
  await prisma.satelliteAnalysis.create({
    data: {
      status: GeocledianStatus.ANALYZED,
      parcelId: '48532',
      entity: 'test',
      name: 'test',

      // See server/test/geocledian.e2e-spec.ts for good sample data
      area: 0.3679,
      countryIso: 'TZA',
      countryRisk: 'standard',
      deforestationAreaHa: 0,
      deforestationRisk: 'low',
      landcoverForestCoverage: 0.08,
      landcoverNoTreesCoverage: 0.92,
      landcoverPlantationCoverage: 0,
      landcoverShrubsCoverage: 0,

      plot: {
        connect: {
          id: farmOne.plots[0].id,
        },
      },
      rawData: JSON.stringify({ hello: true }),
    },
  });
};

const addSatelliteForFarmTwo = async (farmTwo, prisma) => {
  const area: number = farmTwo.plots[0].polygons
    .find((poly) => poly.active)
    .areaCalculated.toNumber();
  const forestsCoverage = 0.2 * area;
  const noTreesCoverage = 0.4 * area;
  const plantation = 0.2 * area;
  const shrubs = area - forestsCoverage - noTreesCoverage - plantation;
  const deforestation = 0.5 * area;
  await prisma.satelliteAnalysis.create({
    data: {
      status: GeocledianStatus.ANALYZED,
      parcelId: '48534',
      entity: 'test',
      name: 'test',

      // See server/test/geocledian.e2e-spec.ts for good sample data
      area: area,
      countryIso: 'TZA',
      countryRisk: 'standard',
      deforestationAreaHa: deforestation,
      deforestationRisk: 'high',
      landcoverForestCoverage: forestsCoverage,
      landcoverNoTreesCoverage: noTreesCoverage,
      landcoverPlantationCoverage: plantation,
      landcoverShrubsCoverage: shrubs,
      plot: {
        connect: {
          id: farmTwo.plots[0].id,
        },
      },
      rawData: JSON.stringify({ hello: true }),
    },
  });
};

const addCertifications = async (
  farmOne: Farm,
  certificationTypes: CertificationType[],
  prisma: PrismaClient,
) => {
  const certFarm = await prisma.certification.create({
    data: {
      organisation: farmOne.organisation,
      status: 'Certified',
      startsAt: new Date(),
      certificationType: {
        connect: {
          id: certificationTypes[0].id,
        },
      },
      farm: {
        connect: {
          id: farmOne.id,
        },
      },
    },
  });

  const certPlot = await prisma.certification.create({
    data: {
      organisation: farmOne.organisation,
      status: 'Certified',
      startsAt: new Date(),
      certificationType: {
        connect: {
          id: certificationTypes[0].id,
        },
      },
      plot: {
        connect: {
          id: farmOne.plots[0].id,
        },
      },
    },
  });
};

const addContactAndWallet = async (farmOne: Farm, prisma: PrismaClient) => {
  const contact = await prisma.contact.create({
    data: {
      organisation: farmOne.organisation,
      type: 'mobilePhone',
      phone: '+256779364863',
      firstName: 'Adam',
      lastName: 'Jones',
      address: 'Some address',
      primary: true,
      person: {
        connect: {
          id: farmOne.facility.mainContactPerson.id,
        },
      },
      shortCode: '+256779364863',
    },
  });

  await prisma.wallet.create({
    data: {
      organisation: farmOne.organisation,
      type: 'MMWallet',
      externalSystemName: 'OneAfriq',
      externalId: '+256779364863',
      externalUuid: '12345678',
      phone: '+256779364863',
      externalName: 'Adam Jones',
      externalFirstName: 'Adan',
      externalLastName: 'Jones',
      contact: {
        connect: {
          id: contact.id,
        },
      },
      shortCode: '+256779364863',
    },
  });
};

const receiveFarmInspectionFromV1ForFarm = async (
  farmWithInspection: Farm,
  farmInspectionService: FirestoreFarmInspectionService,
  activeSeason: Season,
  previousSeason?: Season,
  farmInspectionResult?: any,
) => {
  if (farmWithInspection) {
    await farmInspectionService.process(
      farmInspectionResult,
      farmWithInspection.organisation,
    );

    if (previousSeason) {
      const previousSeasonInspectionResult = {
        ...farmInspectionResult,
        entity: {
          ...farmInspectionResult.entity,
          season: {
            id: previousSeason.id,
            label: previousSeason.shortCode,
            labelShort: previousSeason.shortCode,
          },
        },
      };

      await farmInspectionService.process(
        previousSeasonInspectionResult as any,
        farmWithInspection.organisation,
      );
    } else {
      console.warn('No previous season found in db');
    }

    farmInspectionResult.entity.season = {
      id: activeSeason.id,
      label: activeSeason.shortCode,
      labelShort: activeSeason.shortCode,
    } as any;

    await farmInspectionService.process(
      farmInspectionResult as any,
      farmWithInspection.organisation,
    );
  } else {
    console.warn(
      'Seed data does not contain farm for inspection update: ' +
        farmWithInspection?.facility?.shortCode,
    );
  }
};

export const seedFarms = async (
  farmService: FarmsService,
  farmInspectionService: FirestoreFarmInspectionService,
  locations: Location[],
  customLocations: Location[],
  certificationTypes: CertificationType[],
  prisma: PrismaClient,
  organisation: string,
) => {
  const meta = { organisation };

  const seasons = await prisma.season.findMany({
    where: { organisation },
  });
  const activeSeason = seasons.find((season) => season.active);
  const previousSeason = seasons.find((season) => !season.active);
  if (!activeSeason) {
    throw new Error('No active season found in db');
  }

  // 1) FARM-series, static farms with specific purpose. See Farmer name for clues!
  const exampleFarms = getExampleFarmInputs(
    meta.organisation,
    locations,
    customLocations,
    activeSeason.shortCode,
  );

  const payloads: FarmsDto[] = [...exampleFarms];

  // 2) OVERLAP-series, static farms that overlap with each other
  for (const index of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    const example = generateOverlappingFarm(
      index,
      organisation,
      chance,
      activeSeason.shortCode,
    );
    await farmService.create(example);
  }

  // 3) RANDO-series, randomly generated farms
  for (let i = 1; i <= 30; i++) {
    const location = chance.pickone(locations);
    payloads.push(
      generateRandomFarm(i, organisation, location, activeSeason.shortCode),
    );
  }

  // 4) Create the farms
  const promises = payloads.map(async (payload) => farmService.create(payload));
  await Promise.all(promises);

  // 5) Post processing
  const farmsWithIncludes: { data: Farm[]; count: number } =
    await farmService.getMany({
      organisation: organisation,
    });
  const farmsSet: Record<string, Farm> = {};
  farmsWithIncludes.data.forEach((farm) => {
    farmsSet[farm.facility.shortCode] = farm;
  });
  await addCertifications(farmsSet['FARM-001'], certificationTypes, prisma);
  await addContactAndWallet(farmsSet['FARM-001'], prisma);
  await addSatelliteForFarmOne(farmsSet['FARM-001'], prisma);
  await addSatelliteForFarmTwo(farmsSet['FARM-002'], prisma);
  await receiveFarmInspectionFromV1ForFarm(
    // FARM-004
    farmsSet[farmInspectionResultFromV1.entity.properties.idLabelShort],
    farmInspectionService,
    activeSeason,
    previousSeason,
    farmInspectionResultFromV1,
  );
  await receiveFarmInspectionFromV1ForFarm(
    // FARM-007
    farmsSet[farmInspectionResultFromV2.entity.properties.idLabelShort],
    farmInspectionService,
    activeSeason,
    previousSeason,
    farmInspectionResultFromV2,
  );
};
