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
  for (const farm of farms.data) {
    logger.log('----');
    logger.log('Starting farm ' + farm.facility.shortCode);
    for (const plot of farm.plots) {
      await geoCledianService.getAndStoreAnalysisResponse(
        plot.id,
        organisation,
      );
    }
  }
};

init();
