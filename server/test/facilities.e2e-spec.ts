import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Chance } from 'chance';
import { FacilitiesModule } from '../src/facilities/facilities.module';
import { createTestingModuleWithPrisma } from './test-util';
import { FacilitiesDto } from '../src/facilities/dto/facilities.dto';
import { FacilityType } from '../src/facilities/models/facility.model';
import { FacilitiesService } from '../src/facilities/facilities.service';
import { ChangesService } from '../src/changes/changes.service';

const chance = new Chance();

describe('Facility Service (e2e)', () => {
  let app: INestApplication;
  let facilitiesService: FacilitiesService;
  let changesService: ChangesService;

  beforeEach(async () => {
    const initialized = await createTestingModuleWithPrisma({
      imports: [FacilitiesModule],
    });
    app = initialized.app;
    facilitiesService =
      initialized.moduleFixture.get<FacilitiesService>(FacilitiesService);

    changesService =
      initialized.moduleFixture.get<ChangesService>(ChangesService);
  });

  const org = 'mh';

  it('Get all existing facilities', () => {
    return request(app.getHttpServer()) //
      .get(`/${org}/facilities`)
      .expect(200);
  });

  it('Create new Facility', async () => {
    const payload = {
      shortCode: 'asdf',
      organisation: org,
      name: chance.name(),
      type: 'Farm',
      areaTotalManual: 2,
    };

    return request(app.getHttpServer())
      .post(`/${org}/facilities`)
      .send(payload)
      .expect(201);
  });

  it('Create and update facility, record changes', async () => {
    const payload = {
      shortCode: 'asdf',
      organisation: org,
      name: chance.name(),
      type: FacilityType.Farm,
      areaTotalManual: 2,
    } satisfies Partial<FacilitiesDto>;

    await request(app.getHttpServer())
      .post(`/${org}/facilities`)
      .send(payload)
      .expect(201);

    const facilities = await facilitiesService.getMany({
      organisation: org,
      shortCode: 'asdf',
    });
    expect(facilities.data.length).toBe(1);
    const f = facilities.data[0];

    // No rush
    await new Promise((resolve) => setTimeout(resolve, 50));

    console.log('Updating facility id', f.id);
    const payload2 = {
      ...payload,
      name: chance.name(),
    };

    await request(app.getHttpServer())
      .patch(`/${org}/facilities/${f.id}`)
      .send(payload2)
      .expect(200);

    // Check changes
    await expect(
      changesService
        .getMany({
          objectType: 'Facility',
          objectId: f.id,
          endTime: new Date('2100-01-01T00:00:00.000Z'),
        })
        .then((l) =>
          l.data
            .sort((a, b) => a.name.localeCompare(b.name))
            .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
            .map((c) => ({
              name: c.name,
              oldValue: c.oldValue,
              newValue: c.newValue,
            })),
        ),
    ).resolves.toStrictEqual([
      // Created values
      { name: 'areaTotalManual', oldValue: null, newValue: '2' },
      { name: 'organisation', oldValue: null, newValue: payload2.organisation },
      { name: 'shortCode', oldValue: null, newValue: payload2.shortCode },
      { name: 'type', oldValue: null, newValue: FacilityType.Farm },
      // Updated values
      { name: 'name', oldValue: payload.name, newValue: payload2.name },
    ]);

    // No rush
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Delete the facility
    const res = await request(app.getHttpServer())
      .delete(`/${org}/facilities/${f.id}`)
      .send({})
      .expect(200);
    console.log(res.body.message);
    expect(res.body.sucess).toBe(true);

    // Check changes
    await expect(
      changesService
        .getMany({
          objectType: 'Facility',
          objectId: f.id,
          endTime: new Date('2100-01-01T00:00:00.000Z'),
        })
        .then((l) =>
          l.data
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((c) => ({
              name: c.name,
              oldValue: c.oldValue,
              newValue: c.newValue,
            })),
        ),
    ).resolves.toStrictEqual([
      // Everything is deleted
      { name: 'areaTotalManual', oldValue: '2', newValue: null },
      { name: 'id', oldValue: f.id, newValue: null },
      { name: 'name', oldValue: payload2.name, newValue: null },
      { name: 'organisation', oldValue: payload2.organisation, newValue: null },
      { name: 'shortCode', oldValue: payload2.shortCode, newValue: null },
      { name: 'type', oldValue: FacilityType.Farm, newValue: null },
    ]);
  });
});
