import { PrismaClient } from '@prisma/client';
import { NestFactory } from '@nestjs/core';
import { AppModuleForScripts } from '../src/scripts/appForScripts.module';
import { FarmsService } from '../src/farms/farms.service';
import { mainSeed } from '../src/common/seed/seedMain';
import { FirestoreFarmInspectionService } from '../src/firestore/firestore.farm.inspection.service';

const prisma = new PrismaClient();

/**
 * "Database seeding happens in two ways with Prisma ORM: manually with prisma db seed and automatically in prisma migrate dev and prisma migrate reset."
 *
 * NOTE: Just call a package inside src to get all the build warnings working
 */
async function main() {
  console.log(process.env.NODE_ENV);

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
  const farmsService = context.get<FarmsService>(FarmsService);
  const farmInspectionService = context.get(FirestoreFarmInspectionService);
  await mainSeed(farmsService, farmInspectionService);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
