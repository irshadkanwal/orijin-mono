import { PrismaClient } from '@prisma/client';

export const seedSeasons = async (
  prisma: PrismaClient,
  organisation: string,
  startNextYear = false,
) => {
  const year = new Date().getFullYear();

  // October PREV to PREV YEAR - March PREV YEAR
  const lastPrev = String(year - 2) + '/' + String(year - 1).slice(2);
  const lastPrevStart = new Date(year - 1, 9, 1);
  const lastPrevEnd = new Date(year, 2, 31);
  await prisma.season.create({
    data: {
      shortCode: lastPrev,
      name: lastPrev,
      organisation,
      startsAt: lastPrevStart,
      endsAt: lastPrevEnd,
      active: startNextYear,
    },
  });

  // October PREV YEAR - March THIS YEAR
  const prev = String(year - 1) + '/' + String(year).slice(2);
  const prevStart = new Date(year - 1, 9, 1);
  const prevEnd = new Date(year, 2, 31);
  await prisma.season.create({
    data: {
      shortCode: prev,
      name: prev,
      organisation,
      startsAt: prevStart,
      endsAt: prevEnd,
      active: !startNextYear,
    },
  });

  if (startNextYear) {
    // October THIS YEAR - March NEXT YEAR
    const next = String(year) + '/' + String(year + 1).slice(2);
    const nextStart = new Date(year, 9, 1);
    const nextEnd = new Date(year + 1, 2, 31);

    await prisma.season.create({
      data: {
        shortCode: next,
        name: next,
        organisation,
        startsAt: nextStart,
        endsAt: nextEnd,
        active: true,
      },
    });
  }
};
