import { PrismaClient } from '@prisma/client';

export const seedVarieties = async (
  prisma: PrismaClient,
  organisation: string,
) => {
  const cocoa = await prisma.crop.create({
    data: {
      shortCode: 'cocoa',
      name: 'Cocoa',
      organisation,
    },
  });

  const cocoaVar = await prisma.cropVariety.create({
    data: {
      shortCode: 'greatest-cocoa',
      name: 'Greatest cocoa',
      cropId: cocoa.id,
      organisation,
    },
  });

  const coffee = await prisma.crop.create({
    data: {
      shortCode: 'coffee',
      name: 'Coffee',
      organisation,
    },
  });

  const arabica = await prisma.cropVariety.create({
    data: {
      shortCode: 'arabica-coffee',
      name: 'Arabica',
      cropId: coffee.id,
      organisation,
    },
  });

  const soy = await prisma.crop.create({
    data: {
      shortCode: 'soy',
      name: 'Soy',
      organisation,
    },
  });

  await prisma.cropVariety.create({
    data: {
      shortCode: 'soy-1',
      name: 'Soy',
      cropId: soy.id,
      organisation,
    },
  });
  return [cocoaVar, arabica];
};
