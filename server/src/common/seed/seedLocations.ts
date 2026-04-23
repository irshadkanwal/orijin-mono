import { PrismaClient } from '@prisma/client';
import {
  LocationMainType,
  LTCCustomLocationLevels,
  MhCustomLocationLevels,
} from '../../locations/models/locations.model';

export const exampleLocationData = (organisation) => ({
  name: 'BUNDIBUGYO',
  shortCode: 'BDG',
  type: 'District',
  organisation,
  children: {
    create: [
      {
        shortCode: 'BBD',
        name: 'BUBANDI',
        type: 'SubCounty',
        organisation,
        children: {
          create: [
            {
              shortCode: 'CP-1',
              name: 'CollectionPoint 1',
              type: LTCCustomLocationLevels.COLLECTIONPOINT,
              organisation,
            },
            {
              shortCode: 'CP-2',
              name: 'CollectionPoint 2',
              type: LTCCustomLocationLevels.COLLECTIONPOINT,
              organisation,
            },
            {
              shortCode: 'VI-1',
              name: 'Villge 1',
              type: 'Village',
              organisation,
            },
            {
              shortCode: 'VI-2',
              name: 'Villge 2',
              type: 'Village',
              organisation,
            },
            {
              shortCode: 'VI-3',
              name: 'Villge 3',
              type: 'Village',
              organisation,
            },
          ],
        },
      },
      {
        shortCode: 'BZO',
        name: 'BUKONZO',
        type: 'SubCounty',
        organisation,
      },
      {
        shortCode: 'BTO',
        name: 'BUNDIBUGYO TOWN COUNCIL',
        type: 'SubCounty',
        organisation,
      },
      {
        shortCode: 'BII',
        name: 'BIREMBO',
        type: 'SubCounty',
        organisation,
      },
    ],
  },
});

export const exampleCustomLocationData = (organisation) => ({
  name: 'NORTH',
  shortCode: 'NORTH',
  type: MhCustomLocationLevels.REGION,
  mainType: LocationMainType.CUSTOM,
  organisation,
  children: {
    create: [
      {
        shortCode: 'BGY',
        name: 'BUGINYANYA',
        type: MhCustomLocationLevels.ZONE,
        mainType: LocationMainType.CUSTOM,
        organisation,
        children: {
          create: [
            {
              shortCode: 'BGL',
              name: 'BUMUGIBOLE',
              type: MhCustomLocationLevels.FARMER_GROUP,
              mainType: LocationMainType.CUSTOM,
              organisation,
            },
            {
              shortCode: 'KDD',
              name: 'KIDODO',
              type: MhCustomLocationLevels.FARMER_GROUP,
              mainType: LocationMainType.CUSTOM,
              organisation,
            },
            {
              shortCode: 'LGL',
              name: 'LOGOLI',
              type: MhCustomLocationLevels.FARMER_GROUP,
              mainType: LocationMainType.CUSTOM,
              organisation,
            },
          ],
        },
      },
      {
        shortCode: 'KJR',
        name: 'KAJERE',
        type: MhCustomLocationLevels.ZONE,
        mainType: LocationMainType.CUSTOM,
        organisation,
      },
      {
        shortCode: 'SPI',
        name: 'SIPI',
        type: MhCustomLocationLevels.ZONE,
        mainType: LocationMainType.CUSTOM,
        organisation,
      },
    ],
  },
});

export const seedLocations = async (
  prisma: PrismaClient,
  organisation: string,
) => {
  await prisma.location.create({
    data: exampleLocationData(organisation),
  });
  await prisma.location.create({
    data: exampleCustomLocationData(organisation),
  });

  const global = await prisma.location.findMany({
    where: { organisation: organisation, mainType: LocationMainType.GLOBAL },
    include: { parent: true },
  });
  const custom = await prisma.location.findMany({
    where: { organisation: organisation, mainType: LocationMainType.CUSTOM },
    include: { parent: true },
  });

  return {
    global,
    custom,
  };
};
