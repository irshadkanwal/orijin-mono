import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Chance } from 'chance';
import { PrismaService } from 'nestjs-prisma';
import { SupportServiceModule } from '../src/supportServices/supportService.module';
import { createTestingModuleWithPrisma } from './test-util';

const chance = new Chance();

describe('SupportingService (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  const organisation = 'mh';

  beforeEach(async () => {
    const initialized = await createTestingModuleWithPrisma({
      imports: [SupportServiceModule],
    });
    app = initialized.app;
    prismaService = initialized.moduleFixture.get<PrismaService>(PrismaService);
  });

  it('Get all existing services', () => {
    return request(app.getHttpServer()) //
      .get('/' + organisation + '/service-category-types')
      .expect(200);
  });

  const supportingServiceCategoryTypePayload = {
    shortCode: 'asdf',
    name: chance.name(),
    description: 'asdf',
    organisation: 'seed',
  };

  it('Create new SupportingServiceCategoryType', async () => {
    return request(app.getHttpServer())
      .post('/' + organisation + `/service-category-types`)
      .send(supportingServiceCategoryTypePayload)
      .expect(201);
  });

  it('Create new SupportingServiceCategory', async () => {
    // Duplication from prev test, but DB gets cleared in between for atomic tests
    await request(app.getHttpServer())
      .post('/' + organisation + `/service-category-types`)
      .send(supportingServiceCategoryTypePayload);

    const supportingServiceCategoryType =
      await prismaService.supportingServiceCategoryType.findFirst();

    const randomName = chance.name();

    const payload = {
      supportingServiceCategoryTypeId: supportingServiceCategoryType.id,
      shortCode: 'asdf',
      name: randomName,
      description: 'asdf',
    };

    // Tapa 2 - except jotain suoraan tässä ketjussa, mutta ei vielä palata
    const response = await request(app.getHttpServer())
      .post('/' + organisation + `/service-categories`)
      .send(payload)
      .expect(201);

    // Voi tutkia lisääkin responsea että oliko oikeanlainen
    expect(response.status).toEqual(201);

    // Voi tehdä vielä lisää tarkistuksia, esim. että annetun responsen lisäksi myös erillisellä queryllä tietokannasta löytyy oikea asia
    // Hyödyllinen etenkin jos on paljon trigger-tyylisiä side effectejä, jotka ei välttämättä näy vielä ite submit responsessa
    const categories = await prismaService.supportingServiceCategory.findMany({
      orderBy: { createdAt: 'desc' },
    });
    expect(categories[0].name).toEqual(randomName);
  });

  afterEach(async () => {
    await prismaService.serviceActivityBeneficiaries.deleteMany();
    await prismaService.serviceActivityLocation.deleteMany();
    await prismaService.supportingServiceActivity.deleteMany();
    await prismaService.supportingServiceInputType.deleteMany();
    await prismaService.supportingServiceActivityType.deleteMany();
    await prismaService.supportingServiceCategory.deleteMany();
    await prismaService.supportingServiceCategoryType.deleteMany();
  });
});
