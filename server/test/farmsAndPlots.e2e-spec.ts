import { HttpServer, INestApplication } from '@nestjs/common';
import { Prisma, Season } from '@prisma/client';
import * as request from 'supertest';
import { FacilitiesDto } from '../src/facilities/dto/facilities.dto';
import { FacilityType } from '../src/facilities/models/facility.model';
import { FarmInputValues, PlotDto } from '../src/farms/dto/farms.dto';
import { FarmsModule } from '../src/farms/farms.module';
import { FarmsService } from '../src/farms/farms.service';
import {
  PlotCoordinateSources,
  PlotType,
} from '../src/farms/models/plots.model';
import { createTestingModuleWithPrisma } from './test-util';
import {
  generateOverlappingFarm,
  getExampleFarmInputs,
} from '../src/common/seed/seedData/exampleFarms';
import { PolygonService } from '../src/geodatas/geopolygon.service';
import { Chance } from 'chance';
import { SeasonsService } from '../src/seasons/seasons.service';
import { SeasonsModule } from '../src/seasons/seasons.module';
const chance = new Chance();

describe('Farms and Plots E2E', () => {
  let app: INestApplication;
  let server: HttpServer;
  let farmsService: FarmsService;
  let polygonService: PolygonService;
  let seasonsService: SeasonsService;

  const org = 'test';

  beforeEach(async () => {
    const initialized = await createTestingModuleWithPrisma({
      imports: [FarmsModule, SeasonsModule],
    });
    app = initialized.app;
    server = app.getHttpServer();
    farmsService = initialized.moduleFixture.get<FarmsService>(FarmsService);
    polygonService =
      initialized.moduleFixture.get<PolygonService>(PolygonService);
    seasonsService =
      initialized.moduleFixture.get<SeasonsService>(SeasonsService);
  });

  /**
   *
   */

  const coordinates = [
    [30.1701571, 0.8488141],
    [30.1705245, 0.8487271],
    [30.1704467, 0.8488129],
    [30.1702282, 0.8487563],
    [30.1700357, 0.8486596],
    [30.170148, 0.8485756],
    [30.1703817, 0.8485462],
    [30.1705245, 0.8487271],
    [30.1701571, 0.8488141],
  ] as Prisma.JsonArray;

  const plotPayload: PlotDto = {
    organisation: org,
    name: 'SOME-PLOT',
    polygonCoordinates: coordinates as number[][],
    polygonSource: PlotCoordinateSources.ORIJIN_APP,
    shortCode: 'TODO-FOR-PLOT-SHORTCODE-CREATION', // TODO: Plot shortcode created on the fly or passed in?
    type: PlotType.Permanent,
  };
  describe('Create & update cases', () => {
    const farmValues: FarmInputValues = {};
    const facilityValues: FacilitiesDto = {
      organisation: '',
      areaTotalManual: 0,
      name: 'some farm',
      type: FacilityType.Farm,
      shortCode: 'asdf',
    };

    const farmPayload = {
      farmValues,
      facilityValues,
    };

    const plotPayload: PlotDto = {
      organisation: org,
      name: 'SOME-PLOT',
      polygonCoordinates: coordinates as number[][],
      polygonSource: PlotCoordinateSources.ORIJIN_APP,
      shortCode: 'TODO-FOR-PLOT-SHORTCODE-CREATION', // TODO: Plot shortcode created on the fly or passed in?
      type: PlotType.Permanent,
    };

    it('Create a simple farm', async () => {
      return request(app.getHttpServer())
        .post(`/farms`)
        .send({ ...farmPayload, farmValues: { plots: [plotPayload] } })
        .expect(201);
    });

    it('Create a farm and later a plot to it', async () => {
      const response = await request(server)
        .post(`/farms`)
        .send(farmPayload)
        .expect(201);

      const plot = await request(server)
        .post(`/plots`)
        .send({ farmId: response.body.id, ...plotPayload })
        .expect(201);

      expect(plot.body).toEqual(
        expect.objectContaining({
          name: 'SOME-PLOT',
          shortCode: 'TODO-FOR-PLOT-SHORTCODE-CREATION',
          type: 'Permanent',
          registrationDate: null,
          yieldEstimateProcessed: null,
          yieldEstimateRaw: null,
        }),
      );
    });

    it('Create a farm and update the plot data', async () => {
      const farm = await request(app.getHttpServer())
        .post(`/farms`)
        .send({ ...farmPayload, farmValues: { plots: [plotPayload] } })
        .expect(201);

      const plot = await request(server)
        .post(`/plots`)
        .send({ farmId: farm.body.id, ...plotPayload })
        .expect(201);

      expect(plot.body).toEqual(
        expect.objectContaining({
          name: 'SOME-PLOT',
          shortCode: 'TODO-FOR-PLOT-SHORTCODE-CREATION',
          type: 'Permanent',
          active: null, // TODO: Should this be true by default? Where do we use this?
          registrationDate: null,
          yieldEstimateProcessed: null,
          yieldEstimateRaw: null,
        }),
      );
    });
  });

  describe('Filter cases', () => {
    beforeEach(async () => {
      const season = await seasonsService.create({
        shortCode: '2023/24',
        name: '2023/24',
        organisation: org,
        startsAt: new Date('2023-10-01T00:00:00.000Z'),
        active: true,
      });

      await Promise.all(
        getExampleFarmInputs(org, undefined, undefined, season.shortCode)
          .slice(0, 3)
          .map(async (example) =>
            farmsService.create({
              organisation: org,
              facilityValues: example.facilityValues,
              farmValues: example.farmValues,
            }),
          ),
      );
    });

    it('Get without filters', async () => {
      const result = await request(server).get(`/${org}/farms`).expect(200);
      expect(result.body.count).toEqual(3);
      expect(result.body.data.length).toEqual(3);
    });

    it('Get without filters, but with sorting and checking all data', async () => {
      const result = await request(server)
        .get(`/${org}/farms?sort=name&sortOrder=asc`)
        .expect(200);

      // Confirm sorting
      expect(result.body.data.map((farm) => farm.facility.name)).toEqual([
        'ADELE KAMBALA',
        'GWENDO STEFAN',
        'NO POLYGONS MAN',
      ]);

      // Confirm data
      const firstFarm = result.body.data[0];
      expect({
        facility: {
          shortCode: firstFarm.facility.shortCode,
          mainContactPerson: {
            firstName: firstFarm.facility.mainContactPerson.firstName,
          },
        },
        plots: firstFarm.plots.map((plot) => ({
          shortCode: plot.shortCode,
          polygons: plot.polygons.map((polygon) => ({
            source: polygon.source,
            active: polygon.active,
          })),
        })),
      }).toEqual({
        facility: {
          shortCode: 'FARM-001',
          mainContactPerson: {
            firstName: 'JOSTINA',
          },
        },
        plots: [
          {
            shortCode: 'FARM-1-CODE-1',
            polygons: [
              {
                source: 'IMPORT',
                active: false,
              },
              {
                source: 'AUTOFIX',
                active: true,
              },
            ],
          },
        ],
      });
    });

    it('Get without filters, but only minimal data', async () => {
      const result = await request(server)
        .get(`/${org}/farms-minimal?sort=name&sortOrder=asc`)
        .expect(200);
      expect(result.body.count).toEqual(3);
      expect(result.body.data.length).toEqual(3);
      expect(result.body.data).toEqual([
        {
          id: expect.anything(),
          season: {
            shortCode: '2023/24',
          },
          facility: {
            id: expect.anything(),
            name: 'ADELE KAMBALA',
            shortCode: 'FARM-001',
            coordinate: expect.anything(),
          },
          plots: [
            expect.objectContaining({
              shortCode: 'FARM-1-CODE-1',
              polygons: [
                expect.objectContaining({
                  source: 'AUTOFIX',
                  active: true,
                }),
              ],
            }),
          ],
          updatedAt: expect.anything(),
          updatedBy: 'system',
        },
        {
          id: expect.anything(),
          season: {
            shortCode: '2023/24',
          },
          facility: {
            id: expect.anything(),
            name: 'GWENDO STEFAN',
            shortCode: 'FARM-002',
            coordinate: expect.anything(),
          },
          plots: [
            expect.objectContaining({
              shortCode: 'FARM-2-PLOT-1',
              polygons: [
                expect.objectContaining({
                  active: true,
                }),
              ],
            }),
          ],
          updatedAt: expect.anything(),
          updatedBy: 'system',
        },
        {
          id: expect.anything(),
          season: {
            shortCode: '2023/24',
          },
          facility: {
            id: expect.anything(),
            name: 'NO POLYGONS MAN',
            shortCode: 'FARM-003',
            coordinate: expect.anything(),
          },
          plots: [
            expect.objectContaining({
              shortCode: 'FARM-3-PLOT-1',
              polygons: [],
            }),
          ],
          updatedAt: expect.anything(),
          updatedBy: 'system',
        },
      ]);
    });

    it('Get with filters', async () => {
      const result = await request(server)
        .get(`/${org}/farms?text=ADELE`)
        .expect(200);
      expect(result.body.count).toEqual(1);
      expect(result.body.data.length).toEqual(1);
      expect(result.body.data[0].facility).toEqual(
        expect.objectContaining({ name: 'ADELE KAMBALA' }),
      );
    });
  });

  describe('Get Farms with errors and Fix polygons overlapping', () => {
    beforeEach(async () => {
      for (const index of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
        const example = generateOverlappingFarm(index, org, chance);
        await farmsService.create(example);
      }
    });

    it('Check For Warnings chart data ', async () => {
      const result = await request(server)
        .get(`/${org}/farm-stats/?page=1&limit=10`)
        .expect(200);
      expect(result.body.polygonWarningsCount).toBeDefined();
      expect(result.body.polygonWarningsCount).toEqual({
        'Overlap 1': 10,
        'Overlap 2-3': 0,
        'Overlap 4 or more': 0,
        'Overlap err': 0,
      });
    });

    // TODO: Let's check the logic here, just updating the active value does not yet trigger re-calculation of polygon warnings from the other side of the warning?
    it.skip('Update an overlapping polygon to fixed overlap warning', async () => {
      const result = await request(server)
        .get(`/${org}/farms?polygonStatus=WARNINGS`)
        .expect(200);

      const warningCount = await request(server)
        .get(`/${org}/farm-stats/?page=1&limit=10`)
        .expect(200);
      expect(warningCount.body.polygonWarningsCount).toEqual({
        'Interaction-polygon-overlapping': 5,
      });

      const FarmToUpdate = result.body.data[2];
      const plotToUpdate = FarmToUpdate.plots[0];
      const polygonToUpdate = plotToUpdate.polygons[0];
      const activeStatus = {
        active: false,
      };

      console.log('result', plotToUpdate);

      await polygonService.updatePolygon(polygonToUpdate.id, activeStatus);

      const updatedWarningCount = await request(server)
        .get(`/${org}/farm-stats/?page=1&limit=10`)
        .expect(200);
      expect(updatedWarningCount.body.polygonWarningsCount).toBeDefined();
      expect(warningCount.body.polygonWarningsCount).toEqual({
        'Interaction-polygon-overlapping': 4,
      });
    });
  });
});
