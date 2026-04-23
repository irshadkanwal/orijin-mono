import { NestFactory } from '@nestjs/core';
import { AppModuleForScripts } from './appForScripts.module';
import { FirestoreService } from '../firestore/firestore.service';
import { PrismaService } from 'nestjs-prisma';

const init = async () => {
  console.log('Testing testing');

  const context = await NestFactory.createApplicationContext(
    AppModuleForScripts,
  );
  await context.init();

  const firestoreService = context.get<FirestoreService>(FirestoreService);
  const prismaService = context.get<PrismaService>(PrismaService);
  const farms = await prismaService.farm.findMany();
  console.log('Farms', farms);

  // TODO: Enable this to make the script actually run
  const result = await firestoreService.importFromFirestore('ltc_qa');
};

init();
