import { NestFactory } from '@nestjs/core';
import { AppModuleForScripts } from './appForScripts.module';
import { Logger } from '@nestjs/common';

export const initializeNestForScripts = async (debug = false) => {
  const context = await NestFactory.createApplicationContext(
    AppModuleForScripts,
    {
      logger: debug
        ? [
            'error', //
            'warn',
            'log',
            'debug',
          ]
        : [
            'error', //
            'warn',
            'log',
          ],
    },
  );
  await context.init();
  const logger = new Logger('script');
  return { context, logger };
};
