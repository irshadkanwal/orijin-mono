import { NestFactory } from '@nestjs/core';
import { AppModuleForScripts } from './appForScripts.module';
import { FirestoreExporterService } from '../firestore/export/firestoreExporter.service';
import { getFirestoreExportItems } from './exportToFirestoreUtils';

const init = async () => {
  console.log('== Export toFirestore == ');

  const context = await NestFactory.createApplicationContext(
    AppModuleForScripts,
  );
  await context.init();

  const firestoreExporterService = context.get<FirestoreExporterService>(
    FirestoreExporterService,
  );

  // const org = 'latitude';
  const org = 'seed';
  const workspace = 'seed_test';

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
