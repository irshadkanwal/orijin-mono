import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { FacilityType } from '../src/facilities/models/facility.model';
import { FarmsModule } from '../src/farms/farms.module';
import { FarmsService } from '../src/farms/farms.service';
import { Farm } from '../src/farms/models/farms.model';
import {
  PlotCoordinateSources,
  PlotType,
} from '../src/farms/models/plots.model';
import { FirestoreModule } from '../src/firestore/firestore.module';
import { LocationsModule } from '../src/locations/locations.module';
import { UserType } from '../src/users/models/user.model';
import { createTestingModuleWithPrisma } from './test-util';
import { farmInspectionResultFromV1 } from '../src/common/seed/seedData/farmInspectionResult.json';
import { ChangesService } from '../src/changes/changes.service';
import { realSampleFarmInspection } from './testdata/farmInspection/wip-3/realFarmInspection';
import { Prisma } from '@prisma/client';
import { Polygon } from '../src/geodatas/models/geodatas.model';
import { SeasonsService } from '../src/seasons/seasons.service';
import { SeasonsModule } from '../src/seasons/seasons.module';

describe('Farm inspection from V1 (e2e)', () => {
  let app: INestApplication;
  let farmsService: FarmsService;
  let changesService: ChangesService;
  let seasonsService: SeasonsService;

  const organisation = 'test';

  beforeEach(async () => {
    const initialized = await createTestingModuleWithPrisma({
      imports: [FarmsModule, LocationsModule, FirestoreModule, SeasonsModule],
      providers: [
        // To easily disable some services -> doesnt work if imported as Module first?
        // { provide: FirestoreSeasonImporterService, useValue: null },
        // { provide: FirestoreLocationImporterService, useValue: null },
        // { provide: FirestoreFarmImporterService, useValue: null },
      ],
    });
    app = initialized.app;
    farmsService = initialized.moduleFixture.get<FarmsService>(FarmsService);
    changesService =
      initialized.moduleFixture.get<ChangesService>(ChangesService);
    seasonsService =
      initialized.moduleFixture.get<SeasonsService>(SeasonsService);
  });

  describe('Process inspection results from real', () => {
    it('Should process and add new real farm', async () => {
      const inspectionJson = realSampleFarmInspection; // farmInspectionResultFromV1

      await seasonsService.create({
        shortCode: '2023/24',
        name: '2023/24',
        organisation,
        startsAt: new Date('2023-10-01T00:00:00.000Z'),
        active: true,
      });

      // Confirm nothing exists
      const shortCode = inspectionJson.entity.id.labelShort;
      const initialState = await farmsService.getMany({
        organisation,
        shortCode,
      });
      expect(initialState.data).toEqual([]);

      // Receive creation
      await request(app.getHttpServer())
        .post(`/${organisation}/farmsinspection`)
        .send(inspectionJson)
        .expect(201);

      // Confirm existence
      const afterSubmit = await farmsService.getMany({
        organisation,
        shortCode,
      });

      const farmWithAllIncludes: Farm = await farmsService.getOne({
        org: organisation,
        id: afterSubmit.data[0].id,
      });
      expect(
        farmWithAllIncludes.plots.map((plot) => ({
          shortCode: plot.shortCode,
          name: plot.name,
        })),
      ).toEqual([
        expect.objectContaining({
          name: 'Home ',
          shortCode: 'GLA-0297 - Home ',
        }),
      ]);

      expect(farmWithAllIncludes.facility).toEqual(
        expect.objectContaining({
          shortCode,
          mainContactPerson: expect.objectContaining({
            shortCode,
            type: 'Farmer',
            email: null,
          }),
        }),
      );
    });
  });

  describe('Process inspection results', () => {
    it('Should reject a test farm', async () => {
      const inspectionJson = {
        ...farmInspectionResultFromV1,
        entity: {
          ...farmInspectionResultFromV1.entity,
          // We are rejecting all non master workspace farms from farmInspection service
          meta_workspace: 'ltc_test',
        },
      };

      await seasonsService.create({
        shortCode: '2023/24',
        name: '2023/24',
        organisation,
        startsAt: new Date('2023-10-01T00:00:00.000Z'),
        active: true,
      });

      const response = await request(app.getHttpServer())
        .post(`/${organisation}/farmsinspection`)
        .send(inspectionJson)
        .expect(201);
      expect(response.body).toEqual([]);

      // TODO: Confirm that logger.warn called with:
      // "WARN [FirestoreFarmInspectionService] Got incoming Farm Inspection payload from non-master workspace, skipping: ltc_test"
    });

    it('Should process a new farm', async () => {
      const inspectionJson = farmInspectionResultFromV1;

      await seasonsService.create({
        shortCode: farmInspectionResultFromV1.entity.season.labelShort,
        name: farmInspectionResultFromV1.entity.season.label,
        organisation,
        startsAt: new Date('2023-10-01T00:00:00.000Z'),
        active: true,
      });

      // Confirm nothing exists
      const shortCode = inspectionJson.entity.id.labelShort;
      const initialState = await farmsService.getMany({
        organisation,
        shortCode,
      });
      expect(initialState.data).toEqual([]);

      // Receive creation
      const response = await request(app.getHttpServer())
        .post(`/${organisation}/farmsinspection`)
        .send(inspectionJson)
        .expect(201);

      // Confirm existence
      const afterSubmit = await farmsService.getMany({
        organisation,
        shortCode,
      });

      expect(afterSubmit.data).toEqual([
        expect.objectContaining({
          facility: expect.objectContaining({
            shortCode,
            mainContactPerson: expect.objectContaining({
              shortCode,
              type: 'Farmer',
              email: null,
              phone: '778434715',
              phone2: null,
              firstName: 'Leon',
              middleName: null,
              lastName: 'Thornton',
              nickName: null,
              gender: 'Female',
              maritalStatus: 'Married',
              dateOfBirth: new Date('1980-12-10T00:00:00.000Z'),
              dateOfBirthApproximate: false,
              identificationNumber: 'CF800011111',
              identificationNumberType: 'NationalId',
            }),
          }),
          plots: [
            expect.objectContaining({
              name: 'P1',
              principalOwnsLand: true,
              principalLeasesLand: null,
              hasRightToLand: null,
              hasLandTitle: true,
              ownerName: null,
            }),
          ],
        }),
      ]);
    });
  });

  it('Should update an existing farm', async () => {
    ////////////////
    // 1) Create the existing farm with 2 plots
    ////////////////
    const shortCode = farmInspectionResultFromV1.entity.id.labelShort;
    const originalCoordinates = [
      [30.1701571, 0.8488141],
      [30.1702282, 0.8487563],
      [30.170148, 0.8485756],
      [30.1705245, 0.8487271],
      [30.1701571, 0.8488141],
    ];

    const season = await seasonsService.create({
      shortCode: '2023/24',
      name: '2023/24',
      organisation,
      startsAt: new Date('2023-10-01T00:00:00.000Z'),
      active: true,
    });

    const payloadForExistingFarm = {
      farmValues: {
        seasonId: season.id,
        plots: [
          {
            organisation: organisation,
            shortCode: 'FARM-004 - P1',
            name: 'Original name for P1',
            polygonSource: PlotCoordinateSources.IMPORT,
            polygonCoordinates: originalCoordinates,
            type: PlotType.Permanent,
          },
          {
            organisation: organisation,
            shortCode: 'FARM-004 - PDEL',
            name: 'Nice place by the river',
            type: PlotType.Permanent,
            polygonSource: PlotCoordinateSources.IMPORT,
            polygonCoordinates: originalCoordinates,
          },
        ],
      },
      facilityValues: {
        organisation,
        areaTotalManual: 0,
        name: 'some farm',
        type: FacilityType.Farm,
        shortCode: shortCode,
        mainContactPerson: {
          organisation,
          shortCode: shortCode,
          firstName: '',
          lastName: '',
          type: UserType.Farmer,
          phone: '123',
          gender: 'Female',
          dateOfBirth: undefined,
        },
      },
    };

    const existingFarm = (
      await request(app.getHttpServer())
        .post(`/farms`)
        .send({
          ...payloadForExistingFarm,
        })
        .expect(201)
    ).body;

    // console.info(
    //   'Creating existing farm',
    //   JSON.stringify(existingFarm, null, 2),
    // );

    expect(existingFarm).toEqual(
      expect.objectContaining({
        seasonId: season.id,
        facility: expect.objectContaining({
          shortCode: shortCode,
          mainContactPerson: expect.objectContaining({
            shortCode: shortCode,
            phone: '123',
            firstName: '',
            lastName: '',
          }),
        }),
      }),
    );

    expect(
      existingFarm.plots.map((plot) => ({
        shortCode: plot.shortCode,
        name: plot.name,
        polygons: plot.polygons.map((poly) => ({
          active: poly.active,
          areaCalculated: poly.areaCalculated,
          coordinates: poly.coordinates,
        })),
      })),
    ).toEqual([
      {
        shortCode: 'FARM-004 - P1',
        name: 'Original name for P1',
        polygons: [
          {
            active: true,
            areaCalculated: '0.04394553554940726',
            coordinates: originalCoordinates,
          },
        ],
      },
      {
        shortCode: 'FARM-004 - PDEL',
        name: 'Nice place by the river',
        polygons: [
          {
            active: true,
            areaCalculated: '0.04394553554940726',
            coordinates: originalCoordinates,
          },
        ],
      },
    ]);

    ////////////////
    // 2) Update with payload, containing ONLY plot 'FARM-004 - P1'
    ////////////////
    await request(app.getHttpServer())
      .post(`/${organisation}/farmsinspection`)
      .send(farmInspectionResultFromV1)
      .expect(201);

    // Confirm existence
    const farmAfterUpdate: Farm[] = (
      await farmsService.getMany({
        organisation,
        shortCode,
      })
    ).data as Farm[];

    ////////////////
    // 3) Confirm
    ////////////////
    expect(farmAfterUpdate[0]).toEqual(
      expect.objectContaining({
        facility: expect.objectContaining({
          id: existingFarm.facility.id,
          shortCode,
          mainContactPerson: expect.objectContaining({
            id: existingFarm.facility.mainContactPerson.id,
            shortCode,
            type: 'Farmer',
            email: null,
            phone: '778434715',
            phone2: null,
            firstName: 'Leon',
            middleName: null,
            lastName: 'Thornton',
            nickName: null,
            gender: 'Female',
            maritalStatus: 'Married',
            dateOfBirth: new Date('1980-12-10T00:00:00.000Z'),
            dateOfBirthApproximate: false,
            identificationNumber: 'CF800011111',
            identificationNumberType: 'NationalId',
          }),
        }),
      }),
    );
    expect(farmAfterUpdate[0].plots[0].shortCode).toEqual('FARM-004 - P1');
    expect(farmAfterUpdate[0].plots[0].name).toEqual('P1');
    expect(farmAfterUpdate[0].plots[0].principalOwnsLand).toEqual(true);
    expect(farmAfterUpdate[0].plots[0].hasLandTitle).toEqual(true);
    expect(farmAfterUpdate[0].plots[0].ownerName).toEqual(null);

    const polys = farmAfterUpdate[0].plots[0].polygons
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .map((poly: Polygon) => ({
        active: poly.active,
        source: poly.source,
        coordinates: poly.coordinates,
        areaCalculated: poly.areaCalculated,
        polygonWarnings: poly.polygonWarnings,
      }));

    // Original polygons, now inactive
    expect(polys[0]).toEqual({
      active: false,
      source: PlotCoordinateSources.IMPORT,
      coordinates: originalCoordinates,
      areaCalculated: new Prisma.Decimal('0.04394553554940726'),
      polygonWarnings: [
        // Note! No warnings are sent even if it's "active=false" because it's become inactive due to new polygon coming in!
      ],
    });

    // New one, from Orijin app
    expect(polys[1]).toEqual({
      active: false,
      source: PlotCoordinateSources.ORIJIN_APP,
      // See farmInspectionResultFromV1.entity.plotsFull[0].geodatasFull[0].data,
      coordinates: [
        [24.9716733394062, 60.2496250592509],
        [24.9717733394062, 60.2497250592509],
        [24.9718733394062, 60.2498250592509],
        [24.9719733394062, 60.2499250592509],
        [24.9716733394062, 60.2496250592509],
      ],
      areaCalculated: new Prisma.Decimal(0),
      polygonWarnings: [
        expect.objectContaining({ key: 'Spikes', fixed: false }),
        expect.objectContaining({ key: 'Self-intersects', fixed: false }),
      ],
    });

    // TODO: Change the coordinsates to something that is actually fixable! (Both here and in seed)
    // New one, autofixed
    // expect(polys[2]).toEqual({
    //   active: true,
    //   source: PlotCoordinateSources.AUTOFIX,
    //   // See farmInspectionResultFromV1.entity.plotsFull[0].geodatasFull[0].data,
    //   coordinates: [
    //     [24.9716733394062, 60.2496250592509],
    //     [24.9717733394062, 60.2497250592509],
    //     [24.9718733394062, 60.2498250592509],
    //     [24.9719733394062, 60.2499250592509],
    //     [24.9716733394062, 60.2496250592509],
    //   ],
    //   areaCalculated: new Prisma.Decimal(0),
    // });

    // Check Facility changes
    await expect(
      changesService
        .getMany({
          objectType: 'Facility',
          objectId: existingFarm.facility.id,
          endTime: new Date('2100-01-01T00:00:00.000Z'),
          sourceType: 'update',
        })
        .then((l) =>
          l.data
            .sort((a, b) => a.name.localeCompare(b.name))
            .filter((a) => ['name', 'areaTotalManual'].includes(a.name))
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
        name: 'areaTotalManual',
        oldValue: null,
        newValue: '0.0004110000000000001',
        operationType: 'farmInspection',
        updatedBy: 'salla@orijin.io',
      },
      {
        name: 'name',
        oldValue: 'some farm',
        newValue: 'Leon Thornton',
        operationType: 'farmInspection',
        updatedBy: 'salla@orijin.io',
      },
    ]);
  });
});
