import { NestFactory } from '@nestjs/core';
import { AppModuleForScripts } from './appForScripts.module';
import { PrismaService } from 'nestjs-prisma';
import { emptyDatabase } from '../common/seed/seedMain';

const init = async () => {
  const context = await NestFactory.createApplicationContext(
    AppModuleForScripts,
  );
  await context.init();
  const prismaService = context.get<PrismaService>(PrismaService);
  const result = await emptyDatabase(prismaService);
};

init();
