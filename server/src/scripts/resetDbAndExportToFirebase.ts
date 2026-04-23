import { NestFactory } from '@nestjs/core';
import { AppModuleForScripts } from './appForScripts.module';
import { FirestoreExporterService } from '../firestore/export/firestoreExporter.service';
import { PrismaClient } from '@prisma/client';
import { emptyDatabase } from '../common/seed/seedMain';
import { getFirestoreExportItems } from './exportToFirestoreUtils';
import { getCsvImportFolder, getCsvImportItems } from './importCsvUtils';
import { DataImportService } from '../dataImports/dataImport.service';

const init = async () => {
  console.log('== Export toFirestore == ');

  const context = await NestFactory.createApplicationContext(
    AppModuleForScripts,
  );
  await context.init();

  const firestoreExporterService = context.get<FirestoreExporterService>(
    FirestoreExporterService,
  );

  const dataImportService = context.get<DataImportService>(DataImportService);

  // const org = 'kerem';
  // const org = 'seed';
  const org = 'latitude';
  // const workspace = 'kerem_master';
  const workspace = 'latitude_salla';
  // const workspace = 'seed_test';

  const prisma = new PrismaClient();
  await emptyDatabase(prisma);

  await dataImportService.importAll(
    getCsvImportItems(org),
    `/test/in/${getCsvImportFolder(org)}/`,
    org,
  );

  const result = await firestoreExporterService.exportAll(
    {
      organisation: org,
      workspace: workspace,
      configKey: 'ltc',
      onlyCreate: false,
    },
    getFirestoreExportItems(org),
  );
};

init();
