import { INestApplication } from '@nestjs/common';
import { createTestingModuleWithPrisma } from './test-util';
import { FirestoreService } from '../src/firestore/firestore.service';
import { FirestoreModule } from '../src/firestore/firestore.module';
import { FarmsService } from '../src/farms/farms.service';
import { PersonsService } from '../src/persons/persons.service';
import { FacilitiesService } from '../src/facilities/facilities.service';
import { SupportServiceCategoryService } from '../src/supportServices/supportServiceCategory.service';
import { LocationsService } from '../src/locations/locations.service';
import { ProductsService } from '../src/products/products.service';
import { ProductTypesService } from '../src/products/productTypes.service';
import { SeasonsService } from '../src/seasons/seasons.service';
import { SupportServiceCategoryTypeService } from '../src/supportServices/supportServiceCategoryType.service';
import { CropvarietyService } from '../src/crops/cropvariety.service';
import { CropsService } from '../src/crops/crops.service';
import { PrismaClient } from '@prisma/client';
import { FirestoreExporterService } from '../src/firestore/export/firestoreExporter.service';

describe('Firestore Export Service (e2e)', () => {
  let app: INestApplication;
  let firestoreService: FirestoreService;
  let firestoreExporterService: FirestoreExporterService;
  let farmsService: FarmsService;
  let facilitiesService: FacilitiesService;
  let personsService: PersonsService;
  let locationsService: LocationsService;
  let productsService: ProductsService;
  let productTypesService: ProductTypesService;
  let seasonsService: SeasonsService;
  let supportServiceCategoryTypeService: SupportServiceCategoryTypeService;
  let supportServiceCategoryService: SupportServiceCategoryService;
  let cropsService: CropsService;
  let cropvarietyService: CropvarietyService;

  beforeEach(async () => {
    const initialized = await createTestingModuleWithPrisma({
      imports: [FirestoreModule],
      providers: [
        // To easily disable some services -> doesnt work if imported as Module first?
        // { provide: FirestoreSeasonImporterService, useValue: null },
        // { provide: FirestoreLocationImporterService, useValue: null },
        // { provide: FirestoreFarmImporterService, useValue: null },
      ],
    });
    app = initialized.app;
    firestoreService =
      initialized.moduleFixture.get<FirestoreService>(FirestoreService);

    firestoreExporterService =
      initialized.moduleFixture.get<FirestoreExporterService>(
        FirestoreExporterService,
      );

    farmsService = initialized.moduleFixture.get<FarmsService>(FarmsService);

    cropvarietyService =
      initialized.moduleFixture.get<CropvarietyService>(CropvarietyService);

    cropsService = initialized.moduleFixture.get<CropsService>(CropsService);

    supportServiceCategoryTypeService =
      initialized.moduleFixture.get<SupportServiceCategoryTypeService>(
        SupportServiceCategoryTypeService,
      );

    supportServiceCategoryService =
      initialized.moduleFixture.get<SupportServiceCategoryService>(
        SupportServiceCategoryService,
      );

    locationsService =
      initialized.moduleFixture.get<LocationsService>(LocationsService);

    productsService =
      initialized.moduleFixture.get<ProductsService>(ProductsService);
    productTypesService =
      initialized.moduleFixture.get<ProductTypesService>(ProductTypesService);

    facilitiesService =
      initialized.moduleFixture.get<FacilitiesService>(FacilitiesService);
    personsService =
      initialized.moduleFixture.get<PersonsService>(PersonsService);

    seasonsService =
      initialized.moduleFixture.get<SeasonsService>(SeasonsService);

    personsService =
      initialized.moduleFixture.get<PersonsService>(PersonsService);

    supportServiceCategoryService =
      initialized.moduleFixture.get<SupportServiceCategoryService>(
        SupportServiceCategoryService,
      );
  });

  /**
   * Keep as Skip!
   *
   * Remember to enable override from .env.tests after working with these!
   */
  describe('Firestore export LIVE', () => {
    it(
      'Try to process Firestore data export',
      async () => {
        console.log('HERE');
        if (!process.env.FIREBASE_PROJECT_ID) {
          console.log('No firebase project ID, skipping');
          return;
        }

        console.log('HERE');

        const allowed = await firestoreService.getAllowedOrganizations(
          'TQL1bwid2MQJDwUiyz9FaeuzpwC2',
        );

        expect(allowed).toEqual([
          'latitude',
          'tma',
          'verapaz',
          'otc',
          'mh',
          'seed',
        ]);
        const organisation = 'ltc';

        const prisma = new PrismaClient();
        // await emptyTestDatabase(prisma);
        // const locations = await seedLocations(prisma, organisation);
        // await seedFarms(
        //   farmsService,
        //   locations.global,
        //   locations.custom,
        //   prisma,
        //   organisation,
        // );
        // await seedServices(
        //   prisma.supportingServiceCategoryType,
        //   prisma.supportingServiceCategory,
        //   organisation,
        // );
        // const cropvarieties = await seedVarieties(prisma, organisation);
        // await seedSeasons(prisma, organisation);
        // await seedProducts(cropvarieties, prisma, organisation);

        const items = [
          'locations',
          // 'farms',
          // 'persons',
          // 'crops',
          // 'seasons',
          // 'varieties',
          // 'producttypes',
          // 'products',
          // 'prices',
          // 'servicecategorytypes',
          // 'servicecategories',
          // 'serviceceactivities',
        ];

        const result = await firestoreExporterService.exportAll(
          {
            organisation: 'ltc',
            workspace: 'latitude_salla',
            configKey: 'ltc',
          },
          items,
        );
      },
      30 * 1000,
    );
  });
});
