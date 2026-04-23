import { Farm } from '../src/farms/models/farms.model';
import { ChangesModule } from '../src/changes/changes.module';
import { INestApplication } from '@nestjs/common';
import { createTestingModuleWithPrisma } from './test-util';
import { ChangesService } from '../src/changes/changes.service';
import { FarmsService } from '../src/farms/farms.service';
import * as request from 'supertest';
import {
  PlotCoordinateSources,
  PlotType,
} from '../src/farms/models/plots.model';
import { FarmsDto, PlotDto } from '../src/farms/dto/farms.dto';
import { FarmsModule } from '../src/farms/farms.module';
import { FirestoreFarmInspectionDto } from 'src/firestore/dto/firestore.farmInspection.dto';
import { FirestoreModule } from '../src/firestore/firestore.module';
import { minimalFarm, minimalInspectionChange } from './minimalFarm';

describe('Changes Service (e2e)', () => {
  let app: INestApplication;
  let changesService: ChangesService;
  let farmsService: FarmsService;
  const organisation = 'test';

  beforeEach(async () => {
    const initialized = await createTestingModuleWithPrisma({
      imports: [ChangesModule, FarmsModule, FirestoreModule],
    });
    app = initialized.app;
    farmsService = initialized.moduleFixture.get<FarmsService>(FarmsService);
    changesService =
      initialized.moduleFixture.get<ChangesService>(ChangesService);
  });

  it('farmPlotChangesAsExpected', async () => {
    const shortCode = 'FARM-111';
    const farmPayload: FarmsDto = minimalFarm(
      organisation,
      shortCode,
      undefined,
      [
        {
          organisation: organisation,
          shortCode: shortCode + ' - P1',
          name: shortCode + ' - P1',
          polygonSource: PlotCoordinateSources.IMPORT,
          polygonCoordinates: [
            [30.1701571, 0.8488141],
            [30.1702282, 0.8487563],
            [30.170148, 0.8485756],
            [30.1705245, 0.8487271],
            [30.1701571, 0.8488141],
          ],
          type: PlotType.Permanent,
          areaSizeManual: 0.81,
        } satisfies PlotDto,
      ],
    );

    const farm: Farm = (
      await request(app.getHttpServer())
        .post(`/farms`)
        .send(farmPayload)
        .expect(201)
    ).body;
    expect(farm).toBeDefined();
    expect(farm).toEqual(
      expect.objectContaining({
        id: expect.any(String),
      }),
    );

    const inspectionChangePlot = minimalInspectionChange(
      shortCode,
      farm.facility.name,
      undefined,
      [
        {
          id: {
            labelShort: shortCode + ' - P1',
          },
          name: shortCode + ' - P1',
          type: 'Permanent',
          properties: {
            ...farmPayload.farmValues.plots[0],
          },
          geodatasFull: [
            {
              areaManual: 0.82,
              data: farmPayload.farmValues.plots[0].polygonCoordinates.map(
                (c) => ({
                  lng: c[0],
                  lat: c[1],
                }),
              ),
            },
          ],
        },
        {
          id: {
            labelShort: shortCode + ' - P2',
          },
          name: shortCode + ' - P2',
          type: 'Permanent',
          properties: {
            organisation: organisation,
            shortCode: shortCode + ' - P2',
            name: shortCode + ' - P2',
            polygonSource: PlotCoordinateSources.IMPORT,
          },
          geodatasFull: [
            {
              areaManual: 22.11,
              data: [
                //  Plot for Helsinki
                {
                  lat: 60.16952,
                  lng: 24.93545,
                },
                {
                  lat: 60.16952,
                  lng: 24.93545,
                },
                {
                  lat: 60.16952,
                  lng: 24.93545,
                },
                {
                  lat: 60.16952,
                  lng: 24.93545,
                },
                {
                  lat: 60.16952,
                  lng: 24.93545,
                },
              ],
            },
          ],
        },
      ] satisfies FirestoreFarmInspectionDto['farm']['plotsFull'],
    );

    await request(app.getHttpServer())
      .post(`/${organisation}/farmsinspection`)
      .send(inspectionChangePlot)
      .expect(201);

    // Check Facility changes
    await expect(
      changesService
        .getMany({
          objectType: 'Facility',
          objectId: farm.facility.id,
          endTime: new Date('2100-01-01T00:00:00.000Z'),
          sourceType: 'update',
        })
        .then((l) =>
          l.data
            .sort((a, b) => a.name.localeCompare(b.name))
            .filter((a) => ['name'].includes(a.name))
            .map((c) => ({
              name: c.name,
              oldValue: c.oldValue,
              newValue: c.newValue,
              operationType: c.operationType,
              updatedBy: c.updatedBy,
            })),
        ),
    ).resolves.toStrictEqual([
      {
        name: 'name',
        oldValue: 'Cocoland',
        newValue: 'Cocoaland',
        operationType: 'farmInspection',
        updatedBy: 'salla@orijin.io',
      },
    ]);

    // Check person changes
    await expect(
      changesService
        .getMany({
          objectType: 'Person',
          objectId: farm.facility.mainContactPerson.id,
          endTime: new Date('2100-01-01T00:00:00.000Z'),
          sourceType: 'update',
        })
        .then((l) =>
          l.data
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((c) => ({
              name: c.name,
              oldValue: c.oldValue,
              newValue: c.newValue,
              operationType: c.operationType,
              updatedBy: c.updatedBy,
            })),
        ),
    ).resolves.toStrictEqual([
      {
        name: 'dateOfBirth',
        newValue: '2000-01-01T00:00:00.000Z',
        oldValue: '2001-05-01T00:00:00.000Z',
        operationType: 'farmInspection',
        updatedBy: 'salla@orijin.io',
      },
      {
        name: 'phone',
        newValue: '778434715',
        oldValue: null,
        operationType: 'farmInspection',
        updatedBy: 'salla@orijin.io',
      },
    ]);
  });
});
