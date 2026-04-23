import { HttpServer, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Chance } from 'chance';
import { CropsModule } from '../src/crops/crops.module';
import { CropsService } from '../src/crops/crops.service';
import { createTestingModuleWithPrisma } from './test-util';
import { CropvarietyService } from '../src/crops//cropvariety.service';
import { Crop } from '@prisma/client';

const chance = new Chance();

describe('Crops Service (e2e)', () => {
  let app: INestApplication;
  let server: HttpServer;
  let cropsService: CropsService;
  let cropvarietyService: CropvarietyService;

  beforeEach(async () => {
    const initialized = await createTestingModuleWithPrisma({
      imports: [CropsModule],
    });
    app = initialized.app;
    server = app.getHttpServer();
    cropsService = initialized.moduleFixture.get<CropsService>(CropsService);
    cropvarietyService =
      initialized.moduleFixture.get<CropvarietyService>(CropvarietyService);
  });

  const meta = {
    activityName: 'CreateService2',
    workspace: 'mh_salla',
    organisation: 'mh',
  };

  const createSampleCrop = async (name) => {
    return cropsService.create({
      organisation: 'mh',
      shortCode: name,
      name: 'long_' + name,
    });
  };

  const createSampleCropVariety = async (cropCode, name) => {
    return cropvarietyService.create({
      organisation: 'mh',
      cropCode: cropCode,
      shortCode: name,
      name: 'long_' + name,
    });
  };

  describe('Crop', () => {
    it('Get all existing crop varieties', () => {
      return request(server) //
        .get('/mh/crop-varieties')
        .expect(200);
    });

    describe('Crops', () => {
      it('Create new Crop AND fail if trying to create another with same name', async () => {
        const values = {
          shortCode: 'crop_1',
          name: 'Cocoa',
        };
        await request(server).post(`/mh/crops`).send(values).expect(201);
        await request(server).post(`/mh/crops`).send(values).expect(409);
      });
    });
  });

  describe('CropVariety', () => {
    const createSmallSet = async () => {
      const cocoa: Crop = await createSampleCrop('Cocoa');
      const coffee: Crop = await createSampleCrop('Coffee');
      await createSampleCropVariety(cocoa.shortCode, 'first');
      await createSampleCropVariety(cocoa.shortCode, 'second');
      await createSampleCropVariety(cocoa.shortCode, 'third');
      await createSampleCropVariety(coffee.shortCode, 'arabica');
    };

    describe('Get cases', () => {
      it('Get all varieties when no filters', async () => {
        await createSmallSet();
        return request(server)
          .get(`/mh/crop-varieties`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toEqual({
              count: 4,
              data: [
                expect.objectContaining({ shortCode: 'first' }),
                expect.objectContaining({ shortCode: 'second' }),
                expect.objectContaining({ shortCode: 'third' }),
                expect.objectContaining({ shortCode: 'arabica' }),
              ],
            });
          });
      });

      it('Filter by name', async () => {
        await createSmallSet();
        return request(server)
          .get(`/mh/crop-varieties?name=SeCoNd`)
          .expect((res) => {
            expect(JSON.parse(res.text)).toEqual({
              count: 1,
              data: [expect.objectContaining({ shortCode: 'second' })],
            });
          });
      });

      it(`Filter by crop's shortcode`, async () => {
        await createSmallSet();
        const query = encodeURI('crop.name=long_Coffee');
        return request(server)
          .get(`/mh/crop-varieties?${query}`)
          .expect((res) => {
            expect(JSON.parse(res.text)).toEqual({
              count: 1,
              data: [expect.objectContaining({ shortCode: 'arabica' })],
            });
          });
      });
    });

    describe('Create cases', () => {
      it('Fail when required fields missing', async () => {
        const payload = {
          organisation: 'mh',
          shortCode: 'asdf',
        };

        // Tapa 1 - except jotain suoraan tässä ketjussa, ja returnaa
        return request(app.getHttpServer())
          .post(`/mh/crop-varieties`)
          .send(payload)
          .expect(400);
      });

      it('Fail when crop doesnt exist', async () => {
        const payload = {
          organisation: 'mh',
          shortCode: 'id_for_crop_variety',
          cropId: 'id_for_missing_crop',
          name: chance.name(),
          description: 'asdf',
        };

        return request(app.getHttpServer())
          .post(`/mh/crop-varieties`)
          .send(payload)
          .expect(500);
      });

      it('Successfully create a crop and a variety, and get results out', async () => {
        const cropCode = 'crop_1';
        const crop = await cropsService.create({
          organisation: 'mh',
          shortCode: cropCode,
          name: 'Cocoa',
        });

        const varietyName = chance.name();
        const varietyDescription = 'bla bla';
        const payload = {
          organisation: 'mh',
          shortCode: 'id_for_crop_variety',
          cropCode,
          name: varietyName,
          description: varietyDescription,
        };

        await request(app.getHttpServer())
          .post(`/mh/crop-varieties`)
          .send(payload)
          .expect(201);

        const getResponse = await request(app.getHttpServer()).get(
          `/mh/crop-varieties`,
        );
        expect(getResponse.body.data[0]).toEqual(
          expect.objectContaining({
            cropId: crop.id,
            description: varietyDescription,
            name: varietyName,
            organisation: 'mh',
            shortCode: 'id_for_crop_variety',
            deletedAt: null,
          }),
        );
      });
    });
  });
});
