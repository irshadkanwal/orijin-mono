import { HttpServer, INestApplication } from '@nestjs/common';
import { Chance } from 'chance';
import { createTestingModuleWithPrisma } from './test-util';
import * as request from 'supertest';
import { LocationsModule } from '../src/locations/locations.module';
import { LocationsService } from '../src/locations/locations.service';

const chance = new Chance();

describe('Locations Service (e2e)', () => {
  let app: INestApplication;
  let server: HttpServer;
  let locationsService: LocationsService;

  beforeEach(async () => {
    const initialized = await createTestingModuleWithPrisma({
      imports: [LocationsModule],
    });
    app = initialized.app;
    server = app.getHttpServer();
    locationsService =
      initialized.moduleFixture.get<LocationsService>(LocationsService);
  });

  /**
   *
   */
  describe('Create cases', () => {
    const organisation = 'mh';

    const types = {
      ZONE: 'Zone',
      SUB_COUNTY: 'Subcountry',
      DISTRICT: 'District',
    };

    it('Create addresses', async () => {
      const districtPayload = {
        organisation,
        shortCode: 'DIS',
        name: 'Districto',
        type: types.DISTRICT,
      };
      const district = await locationsService.create(districtPayload);

      const subcountryPayload = {
        organisation,
        shortCode: 'SUB',
        name: 'SubCountygo',
        type: types.SUB_COUNTY,
        parentId: district.id,
      };
      const subcounty = await locationsService.create(subcountryPayload);

      const subcountry2Payload = {
        organisation,
        shortCode: 'SUB2',
        name: 'SubCountygoDa',
        type: types.SUB_COUNTY,
        parentId: district.id,
      };
      await locationsService.create(subcountry2Payload);

      const zonePayload = {
        organisation,
        shortCode: 'ZON',
        name: 'Zoneago',
        type: types.ZONE,
        parentId: subcounty.id,
      };
      const zone = await locationsService.create(zonePayload);

      const allLocations = await request(app.getHttpServer())
        .get('/' + organisation + `/locations`)
        .expect(200);

      if (allLocations.body.data.length > 0) {
        expect(allLocations.body.data).toEqual([
          expect.objectContaining({ shortCode: 'DIS', parentId: null }),
          expect.objectContaining({ shortCode: 'SUB', parentId: district.id }),
          expect.objectContaining({ shortCode: 'SUB2', parentId: district.id }),
          expect.objectContaining({ shortCode: 'ZON', parentId: subcounty.id }),
        ]);
      }

      const singleLocationWithParents = await request(app.getHttpServer())
        .get('/' + organisation + `/locations/${zone.id}`)
        .expect(200);
      expect(singleLocationWithParents.body).toEqual(
        expect.objectContaining({
          name: 'Zoneago',
          parent: expect.objectContaining({
            name: 'SubCountygo',
            parent: expect.objectContaining({
              name: 'Districto',
            }),
          }),
        }),
      );
    });
  });

  describe('Update cases', () => {
    const organisation = 'mh';

    const types = {
      ZONE: 'Zone',
      SUB_COUNTY: 'Subcountry',
      DISTRICT: 'District',
    };

    it('Update addresses', async () => {
      // Create necessary entities
      const districtPayload = {
        organisation,
        shortCode: 'DIS',
        name: 'Districto',
        type: types.DISTRICT,
      };
      const district = await locationsService.create(districtPayload);

      const subcountryPayload = {
        organisation,
        shortCode: 'SUB',
        name: 'SubCountygo',
        type: types.SUB_COUNTY,
        parentId: district.id,
      };
      const subcounty = await locationsService.create(subcountryPayload);

      const zonePayload = {
        organisation,
        shortCode: 'ZON',
        name: 'Zoneago',
        type: types.ZONE,
        parentId: subcounty.id,
      };
      const zone = await locationsService.create(zonePayload);

      // Update the zone entity
      const updatedZonePayload = {
        ...zonePayload,
        id: zone.id,
        name: 'ZoneagoUpdated',
      };
      const updatedZone = await request(app.getHttpServer())
        .patch('/' + organisation + `/locations/${zone.id}`)
        .send(updatedZonePayload)
        .expect(200);

      // Assert the updated zone entity
      expect(updatedZone.body).toEqual(
        expect.objectContaining({
          name: 'ZoneagoUpdated',
        }),
      );

      // Optionally, you can retrieve the updated entity from the database to further assert its state
      const updatedZoneFromDb = await locationsService.getOne({
        id: zone.id,
        org: organisation,
      });
      expect(updatedZoneFromDb.name).toEqual('ZoneagoUpdated');
    });
  });
});
