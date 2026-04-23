import { PrismaService } from 'nestjs-prisma';
import { PlotsService } from '../farms/plots.service';
import { PolygonService } from '../geodatas/geopolygon.service';
import { initializeNestForScripts } from './scriptsUtil';
import { Polygon } from '../geodatas/models/geodatas.model';

const init = async () => {
  const { context, logger } = await initializeNestForScripts(false);
  const prismaService = context.get<PrismaService>(PrismaService);
  const plotsService = context.get<PlotsService>(PlotsService);
  const polygonService = context.get<PolygonService>(PolygonService);

  //constants required for filtering
  const org = 'ltc';
  const activeSeason = await prismaService.season.findFirst({
    where: { active: true },
  });
  const seasonID = activeSeason.id;
  logger.log('activeSeason', activeSeason);

  // delete existing interaction Warnings
  await prismaService.polygonInteractionWarning.deleteMany({
    where: {
      polygons: {
        every: {
          plot: {
            is: {
              farm: {
                is: {
                  organisation: org,
                  season: { id: seasonID },
                },
              },
            },
          },
        },
      },
    },
  });

  //get active polygon and create warnings
  const activePolygons =
    await polygonService.getAllActivePolygonsForOrgAndSeason(org, seasonID);

  let counter = 0;
  for (const polygon of activePolygons) {
    counter++;
    if (counter % 100 === 0) {
      logger.log('Processed ' + counter + ' / ' + activePolygons.length);
    }
    await plotsService.createInteractionWarningsForPolygons(
      polygon,
      [],
      polygon.plot.shortCode,
      activePolygons,
    );
  }
};

init();
