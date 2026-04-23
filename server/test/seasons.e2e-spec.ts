import { LocationsService } from './../src/locations/locations.service';
import { SeasonsService } from '../src/seasons/seasons.service';
import { Farm } from '../src/farms/models/farms.model';
import { ChangesModule } from '../src/changes/changes.module';
import { INestApplication } from '@nestjs/common';
import { createTestingModuleWithPrisma } from './test-util';
import { ChangesService } from '../src/changes/changes.service';
import { FarmsService } from '../src/farms/farms.service';
import * as request from 'supertest';
import { FacilityType } from '../src/facilities/models/facility.model';
import { UserType } from '../src/users/models/user.model';
import {
  PlotCoordinateSources,
  PlotType,
} from '../src/farms/models/plots.model';
import { FarmsDto, PlotDto } from '../src/farms/dto/farms.dto';
import { FarmsModule } from '../src/farms/farms.module';
import { ReviewStatus } from '../src/farms/models/farms.model';
import { FirestoreModule } from '../src/firestore/firestore.module';
import { SeasonsModule } from '../src/seasons/seasons.module';
import { minimalFarm, minimalInspectionChange } from './minimalFarm';
import { FirestoreFarmInspectionDto } from '../src/firestore/dto/firestore.farmInspection.dto';
import { LocationsModule } from '../src/locations/locations.module';
import { MhCustomLocationLevels } from '../src/locations/models/locations.model';

describe('Season proper handling', () => {
  let app: INestApplication;
  let changesService: ChangesService;
  let farmsService: FarmsService;
  let seasonsService: SeasonsService;
  let locationsService: LocationsService;
  const organisation = 'test';

  beforeEach(async () => {
    const initialized = await createTestingModuleWithPrisma({
      imports: [
        ChangesModule,
        FarmsModule,
        FirestoreModule,
        SeasonsModule,
        LocationsModule,
      ],
    });
    app = initialized.app;
    farmsService = initialized.moduleFixture.get<FarmsService>(FarmsService);
    changesService =
      initialized.moduleFixture.get<ChangesService>(ChangesService);
    seasonsService =
      initialized.moduleFixture.get<SeasonsService>(SeasonsService);
    locationsService =
      initialized.moduleFixture.get<LocationsService>(LocationsService);
  });

  it('Can create farm without a season', async () => {
    const shortCode = 'FARM-111';
    const farmPayload = minimalFarm(organisation, shortCode, undefined);

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
        seasonId: null,
      }),
    );
  });

  it('Can create farm with a season', async () => {
    const season = await seasonsService.create({
      shortCode: '2023/24',
      name: '2023/24',
      organisation,
      startsAt: new Date('2023-10-01T00:00:00.000Z'),
      active: true,
    });

    const shortCode = 'FARM-11S';
    const farmPayload = minimalFarm(organisation, shortCode, season.shortCode, [
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
      },
    ]);

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
        seasonId: season.id,
      }),
    );
  });

  it('Can create farm without a season', async () => {
    const shortCode = 'FARM-111';
    const farmPayload = minimalFarm(organisation, shortCode, undefined);

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
        seasonId: null,
      }),
    );
  });

  it('Can create farm with a season, and update via inspection', async () => {
    const season = await seasonsService.create({
      shortCode: '2023/24',
      name: '2023/2024',
      organisation,
      startsAt: new Date('2023-10-01T00:00:00.000Z'),
      active: true,
    });

    const shortCode = 'FARM-11S';
    const farmPayload = minimalFarm(
      organisation,
      shortCode,
      season.shortCode,
      [],
    );

    const farm: Farm = (
      await request(app.getHttpServer())
        .post(`/farms`)
        .send(farmPayload)
        .expect(201)
    ).body;

    const inspectionChangePlot = minimalInspectionChange(
      shortCode,
      farm.facility.name,
      season.shortCode,
      [],
    );

    await request(app.getHttpServer())
      .post(`/${organisation}/farmsinspection`)
      .send(inspectionChangePlot)
      .expect(201);
  });

  it('Can create farm with a season, add inspection then load new season inspection', async () => {
    const globalLocation = await locationsService.create({
      organisation,
      shortCode: 'BTC',
      name: 'BUGANIKERE TOWN COUNCIL',
      mainType: 'GLOBAL',
      type: MhCustomLocationLevels.ZONE,
    });

    const location = await locationsService.create({
      organisation,
      name: 'BIREMBO',
      shortCode: 'BII',
      mainType: 'CUSTOM',
      type: MhCustomLocationLevels.ZONE,
      parentId: globalLocation.id,
    });

    const season = await seasonsService.create({
      shortCode: '23/24',
      name: '2023/2024',
      organisation,
      startsAt: new Date('2023-10-01T00:00:00.000Z'),
      active: true,
    });

    const season2 = await seasonsService.create({
      shortCode: '24/25',
      name: '2024/2025',
      organisation,
      startsAt: new Date('2024-05-01T00:00:00.000Z'),
      active: true,
    });

    const seasons = [season, season2];

    const shortCode = 'FARM-11S';
    const farmPayload = minimalFarm(
      organisation,
      shortCode,
      season.shortCode,
      [],
    );

    const farm: Farm = (
      await request(app.getHttpServer())
        .post(`/farms`)
        .send(farmPayload)
        .expect(201)
    ).body;

    const inspectionChangePlot = minimalInspectionChange(
      shortCode,
      farm.facility.name,
      season.shortCode,
      [],
    );

    const response = await request(app.getHttpServer())
      .post(`/${organisation}/farmsinspection`)
      .send(inspectionChangePlot)
      .expect(201);

    expect(response.body.length).toBe(1);
    expect(response.body).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: farm.id,
          seasonId: season.id,
        }),
      ]),
    );

    const inspectionChangePlot2 = minimalInspectionChange(
      shortCode,
      farm.facility.name,
      season2.shortCode,
      [],
    );

    const response2 = await request(app.getHttpServer())
      .post(`/${organisation}/farmsinspection`)
      .send(inspectionChangePlot2)
      .expect(201);

    const farms: Farm[] = response2.body;

    // Old farm and new farm with new season
    expect(farms.length).toBe(2);
    expect(farms).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: farm.id,
          seasonId: season.id,
        }),
        expect.objectContaining({
          id: expect.not.stringMatching(farm.id),
          seasonId: season2.id,
        }),
      ]),
    );

    console.log(
      farms.map(
        (f, index) =>
          index +
          ': ' +
          f.facility.shortCode +
          ', ' +
          seasons.find((s) => s.id == f.seasonId)?.shortCode,
      ),
    );

    // Both have locationId
    expect(farms[0].facility.locationId).toBe(location.id);
    expect(farms[1].facility.locationId).toBe(location.id);

    // Both have the same person
    expect(farms[0].facility.mainContactPersonId).toBe(
      farm.facility.mainContactPersonId,
    );
    expect(farms[1].facility.mainContactPersonId).toBe(
      farm.facility.mainContactPersonId,
    );
  });
});
