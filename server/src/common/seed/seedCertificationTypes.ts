import { PrismaClient } from '@prisma/client';

export const seedCertificationTypes = async (
  prisma: PrismaClient,
  organisation: string,
) => {
  const organic = await prisma.certificationType.create({
    data: {
      shortCode: 'EC',
      name: 'Organic EU',
      organisation,
    },
  });

  const fairtrade = await prisma.certificationType.create({
    data: {
      shortCode: 'FT',
      name: 'Fair Trade',
      organisation,
    },
  });

  const rainforest = await prisma.certificationType.create({
    data: {
      shortCode: 'RFA',
      name: 'Rain Forest Alliance',
      organisation,
    },
  });
  return [organic, fairtrade, rainforest];
};
