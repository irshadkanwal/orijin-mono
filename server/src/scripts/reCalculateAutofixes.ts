import { PrismaService } from 'nestjs-prisma';
import { PlotsService } from '../farms/plots.service';
import { FarmsService } from '../farms/farms.service';
import { PlotDto } from '../farms/dto/farms.dto';
import {
  Plot,
  PlotCoordinateSources,
  PlotType,
} from '../farms/models/plots.model';
import { initializeNestForScripts } from './scriptsUtil';
import { Logger } from '@nestjs/common';
import { Polygon } from '../geodatas/models/geodatas.model';

const fixFunction = async ({
  farm,
  logger,
  prismaService,
  org,
  plotsService,
}) => {
  const shortCode = farm.facility.shortCode;
  for (const plot of farm.plots) {
    const shortcodeIfFixed = await refixPolygon({
      plot,
      shortCode,
      logger,
      prismaService,
      org,
      plotsService,
    });
    return shortcodeIfFixed;
    // if (shortcodeIfFixed) {
    //   stats.fixed.push(shortcodeIfFixed);
    // } else {
    //   stats.notFixed++;
    // }
  }
};

async function processChunk(
  chunk: any[],
  fn,
  results: iStats,
  { logger, prismaService, org, plotsService },
): Promise<iStats> {
  const interimResults = await Promise.all(
    chunk.map(async (farm) => {
      return fn({ farm, logger, prismaService, org, plotsService });
      // await that.processFarm(
      //   farm,
      //   customLocations.data,
      //   results,
      //   existingFarms.data,
      // ),
      // );
    }),
  );

  interimResults.forEach((result) => {
    if (!result) {
      results.notFixed++;
    } else if (result.fixed) {
      results.fixed.push(result);
    } else if (result.fixed === false) {
      results.unfixable.push(result);
    }
  });
  return results;
}

const processListAsChunks = async (
  list,
  fn,
  chunkSize,
  initialResults: iStats,
  specs: { logger: any; prismaService: any; org: string; plotsService: any },
) => {
  let results: iStats = initialResults;
  for (let i = 0; i < list.length; i += chunkSize) {
    const chunk = list.slice(i, i + chunkSize);
    results = await processChunk(chunk, fn, results, specs);
    console.log(`Processed ${i + chunk.length} out of ${list.length} farms`);
  }
  return results;
};

const getSortedPolygons = (polygons: Polygon[]): Polygon[] => {
  return [...polygons].sort((a, b) => {
    const byTime =
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (byTime === 0) {
      // If the autofix happened on same second as import, place autofix first
      if (a.source === 'AUTOFIX') {
        return -1;
      } else {
        return 1;
      }
    }
    return byTime;
  });
};

const refixPolygon = async ({
  plot,
  shortCode,
  logger,
  prismaService,
  org,
  plotsService,
}: {
  plot: Plot;
  shortCode: string;
  logger: Logger;
  prismaService: PrismaService;
  org: string;
  plotsService: PlotsService;
}) => {
  const latestPolygons: Polygon[] = getSortedPolygons(plot.polygons);
  const latestPolygon: Polygon = latestPolygons[0];
  // console.log('latestPolygon', latestPolygon);
  if (
    !latestPolygon.polygonWarnings.find(
      (warning) =>
        (warning.key === 'Self-intersects' || warning.key === 'Spikes') &&
        warning.fixed === false,
    )
  ) {
    // logger.log(shortCode + ' No self-intersections or spikes found, skipping');
    return null;
  }
  logger.log(shortCode + ' Self-intersection found, fixing');

  const latestNonfixedPolygon = [...latestPolygons]
    .reverse()
    .find((polygon) => polygon.source !== 'AUTOFIX');

  if (!latestNonfixedPolygon?.coordinates) {
    logger.warn(
      'No latest polygon or latest nonfixed polygon had no coordinates for ' +
        shortCode,
      latestNonfixedPolygon,
    );
    return null;
  }

  const plotDto: PlotDto = {
    name: plot.name,
    organisation: org,
    shortCode: plot.shortCode,
    farmId: plot.farmId,
    type: plot.type as PlotType,
    polygonCoordinates: latestNonfixedPolygon.coordinates as number[][],
    polygonSource: latestNonfixedPolygon.source as PlotCoordinateSources,
  };

  // Clear out old polygons
  // await Promise.all(
  //   allPolygons.map(async (polygon) => {
  //     const warningsToDlete =
  //       await prismaService.polygonInteractionWarning.findMany({
  //         where: { polygons: { some: { id: polygon.id } } },
  //       });
  //     await Promise.all(
  //       warningsToDlete.map(async (x) =>
  //         prismaService.polygonInteractionWarning.delete({
  //           where: { id: x.id },
  //         }),
  //       ),
  //     );
  //     const interactionWarningsToDelete =
  //       await prismaService.polygonWarning.findMany({
  //         where: { polygon: { id: polygon.id } },
  //       });
  //     await Promise.all(
  //       interactionWarningsToDelete.map(async (x) =>
  //         prismaService.polygonWarning.delete({
  //           where: { id: x.id },
  //         }),
  //       ),
  //     );
  //     await prismaService.polygon.delete({ where: { id: polygon.id } });
  //   }),
  // );

  const updatedPlot = await plotsService.upsert(plotDto, null, {
    skipInteractionWarnings: true,
    skipStoringOriginal: true,
  });

  if (updatedPlot.polygons.find((poly) => poly.active)) {
    return { shortCode: shortCode, fixed: true };
  } else {
    return { shortCode: shortCode, fixed: false };
  }
};

const results = [];

interface iStats {
  fixed: resultObject[];
  unfixable: resultObject[];
  notFixed: number;
}

interface resultObject {
  shortCode: string;
  fixed: boolean;
}

const init = async () => {
  const { context, logger } = await initializeNestForScripts(false);
  const prismaService = context.get<PrismaService>(PrismaService);
  const farmsService = context.get<FarmsService>(FarmsService);
  const plotsService = context.get<PlotsService>(PlotsService);

  const org = 'ltc';
  const season = '2024/25';
  const farms = await farmsService.getMany({
    organisation: org,
    seasonCode: season,
  });

  // const chunkSize = 20;
  // const allFarms = farmData.slice(0, limit);

  const initialStats: iStats = {
    fixed: [],
    unfixable: [],
    notFixed: 0,
  };

  const stats: iStats = await processListAsChunks(
    farms.data,
    fixFunction,
    50,
    initialStats,
    { logger, prismaService, org, plotsService },
  );

  console.log('Fixed: ' + stats.fixed.length);
  console.log('Unfixable: ' + stats.unfixable.length);
  console.log('Not fixed: ' + stats.notFixed);
  console.log(
    'Examples of fixed: ' +
      stats.fixed.map((fixed) => fixed.shortCode).slice(0, 10),
  );
  console.log(
    'Examples of unfixable: ' +
      stats.unfixable.map((unfixable) => unfixable.shortCode).slice(0, 10),
  );
};

init();
