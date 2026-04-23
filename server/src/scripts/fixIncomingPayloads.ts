import { PrismaService } from 'nestjs-prisma';
import { PlotsService } from '../farms/plots.service';
import { FarmsService } from '../farms/farms.service';
import { initializeNestForScripts } from './scriptsUtil';
import { JsonPayload } from '@prisma/client';

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
  const payloads = await prismaService.jsonPayload.findMany({
    where: {
      organisation: org,
    },
  });

  for (const payload of payloads) {
    const farm = farms.data.find(
      (farm) => farm.facility.shortCode === payload.entityId,
    );
    if (!farm) {
      console.log('Farm not found for ' + payload.entityId);
      continue;
    }
    await farmsService.updateIncomingJsonPayload(payload.id, farm.id);
  }
};

init();
