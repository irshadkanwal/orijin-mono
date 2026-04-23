import { PrismaClient } from '@prisma/client';
import { Chance } from 'chance';

const prisma = new PrismaClient();
const chance = new Chance();

const generateUniqueShortCode = async (prefix: string, prisma: PrismaClient, organisation: string): Promise<string> => {
  let shortCode: string;
  let isUnique = false;

  while (!isUnique) {
      // Generate a short code
      const guid = chance.guid().replace(/-/g, '');
      shortCode = `${prefix}-${guid.slice(0, 3)}`;

      // Check if it already exists
      const existingFacility = await prisma.facility.findFirst({
          where: {
              shortCode,
              organisation
          }
      });

      if (!existingFacility) {
          isUnique = true;
      }
  }

  return shortCode;
};

const createFacility = async (index: number, organisation: string) => {
  const shortCode = await generateUniqueShortCode("VSL", prisma, organisation);
  await prisma.facility.create({
    data: {
      shortCode:`FAC-${String(index).padStart(3, '0')}`,
      organisation,
      name: chance.name(),
      type: chance.pickone(['Other']),
      areaTotalManual: chance.floating({ min: 100, max: 10000, fixed: 2 }),
      address: {
        street: chance.address(),
        city: chance.city(),
        postalCode: chance.zip(),
        country: chance.country(),
      },
      locationId: null, // Provide a valid Location ID if needed
      customLocationId: null, // Provide a valid Custom Location ID if needed
      coordinateId: null, // Provide a valid GeoCoordinate ID if needed
      mainContactPersonId: null, // Provide a valid Person ID if needed
      countryIso: chance.country({ full: true }),
      timezone: chance.pickone(["America/New_York", "Europe/London"]),
      // Optional fields
      tags: {
        create: [
          {
            name: `Tag-${chance.word()}`,
            organisation,
          },
          { name: `Tag-${chance.word()}`, organisation },
        ],
      },
      vessles: {
        create: [
          {
            shortCode: shortCode,
            name: chance.name(),
            type: 'TypeA',
            organisation,
            subType: '',
          },
        ],
      },
    },
  });
};

export const seedFacilities = async (organisation: string) => {
  console.log('Seeding facilities...');
  // Create a number of facilities, adjust count as needed
  for (let i = 1; i <= 10; i++) {
    await createFacility(i, organisation);
  }
  console.log('Facilities seeded successfully.');
};
