import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestingModuleWithPrisma } from './test-util';
import { FiltersModule } from '../src/filters/filters.module';
import { SeasonsModule } from '../src/seasons/seasons.module';
import { SeasonsService } from '../src/seasons/seasons.service';

describe('FarmFilters (e2e)', () => {
  let app: INestApplication;
  const organisation = 'test';
  let seasonsService: SeasonsService;

  beforeEach(async () => {
    const initialized = await createTestingModuleWithPrisma({
      imports: [FiltersModule, SeasonsModule],
      providers: [],
    });
    app = initialized.app;
    seasonsService =
      initialized.moduleFixture.get<SeasonsService>(SeasonsService);
    await app.init();
  });

  it('/filters/farms (GET)', async () => {
    await seasonsService.create({
      shortCode: '2023/24',
      name: '2023/24',
      organisation,
      startsAt: new Date('2023-10-01T00:00:00.000Z'),
      active: true,
    });

    return request(app.getHttpServer())
      .get('/' + organisation + '/filters/farms/')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);

        const seasonCode = res.body.find(
          (filter) => filter.key === 'seasonCode',
        );

        expect(seasonCode).toMatchObject({
          key: 'seasonCode',
          type: 'select',
          options: expect.arrayContaining([
            { value: '2023/24', label: '2023/24' },
          ]),
        });
      });
  });
});
