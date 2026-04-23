import { HttpServer, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ScoringModule } from '../src/scoring/scoring.module';
import { createTestingModuleWithPrisma } from './test-util';
import { RunScoringDto } from '../src/scoring/dto/scoring.dto';
import { PrismaService } from 'nestjs-prisma';
import { getExampleFarmInputs } from '../src/common/seed/seedData/exampleFarms';
import { FarmsService } from '../src/farms/farms.service';
import { FarmsModule } from '../src/farms/farms.module';

describe('ScoringController (e2e)', () => {
  let app: INestApplication;
  let server: HttpServer;
  let prisma: PrismaService;
  let farmService: FarmsService;
  let org = 'test';
  beforeEach(async () => {
    const initialized = await createTestingModuleWithPrisma({
      imports: [ScoringModule, FarmsModule],
    });
    app = initialized.app;
    server = app.getHttpServer();
    prisma = initialized.moduleFixture.get<PrismaService>(PrismaService);
    farmService = initialized.moduleFixture.get<FarmsService>(FarmsService);
  });

  //TODO implement expect condition after proper scoring impelementation
  describe('Post Rules and Farm ID', () => {
    beforeEach(async () => {
      await Promise.all(
        getExampleFarmInputs(org).map(async (example) =>
          farmService.create({
            organisation: org,
            facilityValues: example.facilityValues,
            farmValues: example.farmValues,
          }),
        ),
      );
    });

    //TODO implementing Get farm and pass ID
    it.skip('/scoring (GET)', async () => {
      const scoringDto: RunScoringDto = { ruleIDs: ['TEST'], farmID: 'TEST' };

      await request(app.getHttpServer())
        .post('/scoring')
        .send(scoringDto)
        .expect(404);
    });
  });
});
