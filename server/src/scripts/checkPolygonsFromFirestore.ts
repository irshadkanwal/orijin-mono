import { NestFactory } from '@nestjs/core';
import { AppModuleForScripts } from './appForScripts.module';
import { FirestoreService } from '../firestore/firestore.service';

const init = async () => {
  console.log('== Get latest polygons from Firestore == ');

  const context = await NestFactory.createApplicationContext(
    AppModuleForScripts,
  );
  await context.init();

  const firestoreService = context.get<FirestoreService>(FirestoreService);
  // const prismaService = context.get<PrismaService>(PrismaService);
  // const farms = await prismaService.farm.findMany();
  // console.log('Farms', farms);

  await firestoreService.importPolygonsFromFirestore('ltc_test24');
};

init();
