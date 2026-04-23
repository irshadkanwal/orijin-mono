import { NestFactory } from '@nestjs/core';
import { AppModuleForScripts } from './appForScripts.module';
import { FirestoreExporterService } from '../firestore/export/firestoreExporter.service';

const init = async () => {
  console.log('==Export missing data to firestore== ');

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

  const items_ltc = [
    'locations',
    'facilities',
    'crops',
    'seasons',
    'serviceactivitytypes',
    'producttypes',
    'varieties',
    'products',
    'prices',
    // 'farms',
    // 'persons',
    'certificationtypes',
    'serviceactivitytypes',
  ];

  const items_mh = [
    'locations',
    'facilities',
    'crops',
    'seasons',
    'producttypes',
    'varieties',
    'products',
    'prices',
    'farms',
    // 'farms_min',
    'persons',
    'certificationtypes',
    'serviceactivitytypes',
  ];

  const items_seed = [
    'locations',
    'facilities',
    'crops',
    'seasons',
    'producttypes',
    'varieties',
    'products',
    'prices',
    'farms',
    'persons',
    'certificationtypes',
    'serviceactivitytypes',
  ];

  const items = {
    mh: items_mh,
    ltc: items_ltc,
    seed: items_seed,
    latitude: items_ltc,
  };

  const result = await firestoreExporterService.exportAll(
    {
      organisation: org,
      workspace: workspace,
      configKey: 'ltc',
      onlyCreate: true,
    },
    items[org],
  );
};

init();
