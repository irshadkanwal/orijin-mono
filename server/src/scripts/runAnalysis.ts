import { NestFactory } from '@nestjs/core';
import { AppModuleForScripts } from './appForScripts.module';
import { FarmStatsService } from '../farms/farm.stats.service';

const init = async () => {
  const context = await NestFactory.createApplicationContext(
    AppModuleForScripts,
  );
  await context.init();

  const farmStatsService: FarmStatsService =
    context.get<FarmStatsService>(FarmStatsService);
  const args = process.argv.slice(2);
  console.log('Args', args);
  const results = await farmStatsService.getStats({ organisation: 'ltc' });
  console.log(JSON.stringify(results, null, 4));
};

init();
