import { HttpServer, INestApplication } from '@nestjs/common';
import { createTestingModuleWithPrisma } from './test-util';
import * as request from 'supertest';
import { examplePersons } from '../src/common/seed/seedData/exampleFarms';
import { PersonsService } from '../src/persons/persons.service';
import { PersonsModule } from '../src/persons/persons.module';
import { exampleLocationData } from '../src/common/seed/seedLocations';
import { LocationsModule } from '../src/locations/locations.module';
import { LocationsService } from '../src/locations/locations.service';
import { FacilitiesService } from '../src/facilities/facilities.service';
import { FacilityType } from '../src/facilities/models/facility.model';
import { FacilitiesModule } from '../src/facilities/facilities.module';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

describe('Persons E2E', () => {
  let app: INestApplication;
  let server: HttpServer;
  let personsService: PersonsService;
  let facilityService: FacilitiesService;
  let locationService: LocationsService;
  let prisma: PrismaService;

  const org = 'test';

  beforeEach(async () => {
    const initialized = await createTestingModuleWithPrisma({
      imports: [PersonsModule, PrismaModule, FacilitiesModule, LocationsModule],
    });
    app = initialized.app;
    server = app.getHttpServer();
    personsService =
      initialized.moduleFixture.get<PersonsService>(PersonsService);
    locationService =
      initialized.moduleFixture.get<LocationsService>(LocationsService);
    facilityService =
      initialized.moduleFixture.get<FacilitiesService>(FacilitiesService);
    prisma = initialized.moduleFixture.get<PrismaService>(PrismaService);
  });

  describe('Filter cases', () => {
    beforeEach(async () => {
      const districtLocation = await prisma.location.create({
        data: exampleLocationData(org),
        include: {
          children: { include: { children: { include: { children: true } } } },
        },
      });
      const personData = examplePersons(org);
      await facilityService.create({
        organisation: org,
        shortCode: 'FARM-1',
        name: 'FARM FARM',
        type: FacilityType.Farm,
        areaTotalManual: 2,
        location: districtLocation.children[0].children[0], // Village 1
        mainContactPerson: personData[0],
      });
      await facilityService.create({
        organisation: org,
        shortCode: 'FARM-2',
        name: 'FARM FARM',
        type: FacilityType.Farm,
        areaTotalManual: 2,
        location: districtLocation.children[0].children[1], // Village 2
        mainContactPerson: personData[1],
      });
    });

    it.only('Get without filters', async () => {
      const result = await request(server).get(`/${org}/persons`).expect(200);
      expect(result.body.count).toEqual(2);
      expect(result.body.data.length).toEqual(2);
    });

    it('Get without filters for another organisation', async () => {
      const result = await request(server).get(`/wrong/persons`).expect(200);
      expect(result.body.count).toEqual(0);
      expect(result.body.data.length).toEqual(0);
    });

    it('Get with filter on subcounty', async () => {
      const result = await request(server)
        .get(`/${org}/persons?location=BBD`)
        .expect(200);
      expect(result.body.count).toEqual(2);
      expect(result.body.data.length).toEqual(2);
    });

    it('Get with filter on village', async () => {
      const result = await request(server)
        .get(`/${org}/persons?location=VI-2`)
        .expect(200);
      expect(result.body.count).toEqual(1);
      expect(result.body.data.length).toEqual(1);
      expect(result.body.data[0].mainContactPersonFor[0]).toEqual(
        expect.objectContaining({ shortCode: 'FARM-2' }),
      );
    });
  });
});
