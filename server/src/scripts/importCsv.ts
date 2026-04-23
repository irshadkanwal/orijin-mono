import { NestFactory } from '@nestjs/core';
import { AppModuleForScripts } from './appForScripts.module';
import { DataImportService } from '../dataImports/dataImport.service';
import { getCsvImportFolder, getCsvImportItems } from './importCsvUtils';

const init = async () => {
  const context = await NestFactory.createApplicationContext(
    AppModuleForScripts,
  );
  await context.init();

  const dataImportService = context.get<DataImportService>(DataImportService);

  // const org = 'mh';
  const org = 'seed';
  // const org = 'seed';
  // const org = 'latitude';

  await dataImportService.importAll(
    getCsvImportItems(org),
    `/test/in/${getCsvImportFolder(org)}/`,
    org,
  );
};

init();
