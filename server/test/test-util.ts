import { Test, TestingModule } from '@nestjs/testing';
import { ModuleMetadata } from '@nestjs/common';
import { PrismaModule, PrismaService } from 'nestjs-prisma';
import { applyCommonAppSettings } from '../src/main.utils';
import { TestsLogger } from './testsLogger';
import { emptyDatabase } from '../src/common/seed/seedMain';
import { PrismaClient } from '@prisma/client';

/**
 * A common helper to create unified E2E test modules
 *
 * @param metadata
 */
export const createTestingModuleWithPrisma = async (
  metadata: ModuleMetadata,
  overrideFunction: any = (testBuilder) => testBuilder,
) => {
  const testingModuleBuilder = Test.createTestingModule({
    imports: [
      PrismaModule.forRoot({
        isGlobal: true,
        prismaServiceOptions: {
          prismaOptions: {
            log: [
              // { level: 'query', emit: 'stdout' }, // Log query events
              // { level: 'info', emit: 'stdout' }, // Log informational events
              // { level: 'warn', emit: 'stdout' }, // Log warnings
              // { level: 'error', emit: 'stdout' }, // Log errors
            ],
          },
          middlewares: [
            // loggingMiddleware({
            //   logger: new Logger('PrismaMiddleware'),
            //   logLevel: 'log',
            // }),
          ],
        },
      }),
      ...metadata.imports,
    ],
    controllers: metadata.controllers,
    providers: metadata.providers,
  });

  const moduleFixture: TestingModule = await overrideFunction(
    testingModuleBuilder,
  ).compile();
  const app = moduleFixture.createNestApplication();
  applyCommonAppSettings(app);

  if (process.env.NODE_ENV !== 'ci') {
    app.useLogger(new TestsLogger());
  }
  await app.init();
  // logStartup();

  const prismaService = moduleFixture.get<PrismaService>(PrismaService);
  await emptyDatabase(prismaService);

  return { app, moduleFixture };
};
