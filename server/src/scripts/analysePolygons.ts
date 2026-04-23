import { NestFactory } from '@nestjs/core';
import { AppModuleForScripts } from './appForScripts.module';
import { FarmsService } from '../farms/farms.service';
import { Logger } from '@nestjs/common';
import { GeocledianService } from '../geocledian/geocledian.service';

const init = async () => {
  const context = await NestFactory.createApplicationContext(
    AppModuleForScripts,
    {
      logger: [
        'error', //
        'warn',
        'log',
        // 'debug'
      ],
    },
  );
  await context.init();
  const logger = new Logger('analysePolygons');
  const geoCledianService = context.get<GeocledianService>(GeocledianService);
  const farmsService = context.get<FarmsService>(FarmsService);

  const organisation = 'kamili';

  const farms = await farmsService.getMany({ organisation });
  console.log('Farms', farms.data.length);

  // FARM-2125

  for (const farm of farms.data.slice(750, 2500)) {
    logger.log('----');
    logger.log('Starting farm ' + farm.facility.shortCode);
    const foundAnalysis = farm.plots.flatMap((plot) => plot.satelliteAnalysis);
    if (foundAnalysis.length > 0) {
      logger.warn(
        'Already asked satellite for ' +
          farm.facility.shortCode +
          ', parcelIds: ' +
          foundAnalysis.map((analysis) => analysis.parcelId),
      );
      continue;
    }
    try {
      await geoCledianService.submitAnalysisRequest(farm.id, organisation);
    } catch (e) {
      logger.error('Error', e);
    }
  }
};

init();
