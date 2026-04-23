import { NestFactory } from '@nestjs/core';
import { AppModuleForScripts } from './appForScripts.module';
import { DataImportService } from '../dataImports/dataImport.service';
import { emptyDatabase } from '../common/seed/seedMain';
import { PrismaClient } from '@prisma/client';

const init = async () => {
  const context = await NestFactory.createApplicationContext(
    AppModuleForScripts,
  );
  await context.init();

  const dataImportService = context.get<DataImportService>(DataImportService);

  // const org = 'mh';
  const org = 'seed';
  const prisma = new PrismaClient();
  //should do this for org Only!!!!
  await emptyDatabase(prisma);
};

init();
