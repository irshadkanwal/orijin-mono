import { INestApplication } from '@nestjs/common';
import { createTestingModuleWithPrisma } from './test-util';
import { FarmsService } from '../src/farms/farms.service';
import { DataImportsModule } from '../src/dataImports/dataImports.module';
import { LtcDataImportService } from '../src/dataImports/ltc.dataImport.service';
import { Prisma } from '@prisma/client';
import { MhDataImportService } from '../src/dataImports/mh.dataImport.service';
import { KokoaKamiliDataImportService } from '../src/dataImports/kokoaKamili.dataImport.service';
import { MhRawDataImportService } from '../src/dataImports/mhRaw.dataImport.service';
import { LocationsService } from '../src/locations/locations.service';
import { PrismaService } from 'nestjs-prisma';

jest.setTimeout(60 * 1000);

describe('Data Import Service (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let farmsService: FarmsService;
  let locationsService: LocationsService;
  let dataImportService: LtcDataImportService;
  let mhDataImportService: MhDataImportService;
  let mhRawDataImportService: MhRawDataImportService;
  let kkDataImportService: KokoaKamiliDataImportService;

  beforeEach(async () => {
    const initialized = await createTestingModuleWithPrisma({
      imports: [DataImportsModule],
      providers: [],
    });
    app = initialized.app;
    prisma = initialized.moduleFixture.get<PrismaService>(PrismaService);
    farmsService = initialized.moduleFixture.get<FarmsService>(FarmsService);
    locationsService =
      initialized.moduleFixture.get<LocationsService>(LocationsService);
    dataImportService =
      initialized.moduleFixture.get<LtcDataImportService>(LtcDataImportService);
    mhDataImportService =
      initialized.moduleFixture.get<MhDataImportService>(MhDataImportService);
    mhRawDataImportService =
      initialized.moduleFixture.get<MhRawDataImportService>(
        MhRawDataImportService,
      );
    kkDataImportService =
      initialized.moduleFixture.get<KokoaKamiliDataImportService>(
        KokoaKamiliDataImportService,
      );
  });

  /**
   *
   * NOTE! Tests used for building one-off import files
   *
   * Can be skipped in CI!
   *
   */
  describe('Data import tests', () => {
    describe.skip('Kokoa Kamili Data Import', () => {
      it('Import', async () => {
        const result = await kkDataImportService.importKamili();
        expect(result.length).toEqual(1522);
        expect(result[0]).toEqual({});
      });
    });

    describe.skip('MH Data Import', () => {
      it('Import new file format', async () => {
        await prisma.season.create({
          data: {
            organisation: 'mh',
            startsAt: new Date(),
            active: true,
            shortCode: 'season23/24',
            name: 'season23/24',
          },
        });
        await locationsService.create({
          name: 'LOGOLI',
          organisation: 'mh',
          shortCode: 'LOG',
          type: 'Farmergroups',
          mainType: 'CUSTOM',
        });
        const result = await mhRawDataImportService.importMHRawFormat(3);
        expect(result.farms.map((farm) => farm.facility.shortCode)).toEqual([]);
      });

      it.skip('Import old file format', async () => {
        const result = await mhDataImportService.importMh();
        expect(result.customLocations.regions.length).toEqual(2);
        expect(result.customLocations.zones.length).toEqual(10);
        expect(result.customLocations.farmerGroups.length).toEqual(33);
        expect(result.regularLocations.length).toEqual(475);
        expect(
          result.regularLocations.find((loc) => loc.shortCode === 'BUD'),
        ).toEqual(
          expect.objectContaining({
            coordinateId: null,
            mainType: 'GLOBAL',
            name: 'BUDUDA',
            organisation: 'mh',
            parent: null,
            parentId: null,
            shortCode: 'BUD',
            type: 'District',
          }),
        );
        expect(
          result.regularLocations.find((loc) => loc.name === 'MUKOTO'),
        ).toEqual(
          expect.objectContaining({
            organisation: 'mh',
            mainType: 'GLOBAL',
            type: 'SubCounty',
            name: 'MUKOTO',
            shortCode: 'MKT',
            parent: expect.objectContaining({
              organisation: 'mh',
              mainType: 'GLOBAL',
              type: 'District',
              name: 'NAMISINDWA',
              shortCode: 'NAM',
            }),
          }),
        );

        expect(result.farms.length).toEqual(846);

        const oneFarm = result.farms.find(
          (farm) => farm.facility.shortCode === 'MH-MYY-002',
        );

        expect(oneFarm).toEqual(
          expect.objectContaining({
            approvalStatus: null,
            certificationStartDate: null,
            certificationStatus: 'NotCertified',
            certifications: null,
            contractDate: new Date('2019-07-08T00:00:00.000Z'),
            creationStatus: null,
            deletedAt: null,
            facility: expect.objectContaining({
              address: null,
              areaTotalManual: null,
              coordinate: expect.objectContaining({
                latitude: new Prisma.Decimal(1.27354),
                longitude: new Prisma.Decimal(34.3857),
              }),
              deletedAt: null,
              firestoreId: null,
              location: expect.objectContaining({
                coordinateId: null,
                deletedAt: null,
                mainType: 'GLOBAL',
                name: 'BUMUGIBOLE',
                organisation: 'mh',
                parent: expect.objectContaining({
                  coordinateId: null,
                  deletedAt: null,
                  mainType: 'GLOBAL',
                  name: 'BULAMBULI',
                  organisation: 'mh',
                  parent: null,
                  parentId: null,
                  shortCode: 'BLB',
                  type: 'District',
                }),
                shortCode: 'BMG2',
                type: 'SubCounty',
              }),
              customLocation: expect.objectContaining({
                organisation: 'mh',
                mainType: 'CUSTOM',
                name: 'MAYIYI',
                shortCode: 'MYY',
                type: 'Farmergroups',
                parent: expect.objectContaining({
                  organisation: 'mh',
                  mainType: 'CUSTOM',
                  name: 'YILWANAKOMAYIYI',
                  type: 'Zone',
                  shortCode: 'YMY',
                  parent: expect.objectContaining({
                    coordinateId: null,
                    mainType: 'CUSTOM',
                    name: 'NORTH',
                    organisation: 'mh',
                    parent: null,
                    parentId: null,
                    shortCode: 'NORTH',
                    type: 'Region',
                  }),
                }),
              }),
              mainContactPerson: expect.objectContaining({
                customFields: null,
                dateOfBirth: new Date('1980-04-20T00:00:00.000Z'),
                dateOfBirthApproximate: null,
                deletedAt: null,
                education: null,
                email: null,
                firstName: 'MILON',
                gender: 'Male',
                identificationNumber: null,
                identificationNumberType: null,
                lastName: 'GIDUDU',
                maritalStatus: null,
                middleName: null,
                nickName: null,
                organisation: 'mh',
                phone: '781568774',
                phone2: null,
                shortCode: 'MH-MYY-002',
                type: 'Farmer',
              }),
              name: 'GIDUDU MILON',
              organisation: 'mh',
              shortCode: 'MH-MYY-002',
              timezone: null,
              type: 'Farm',
            }),
            firestoreId: null,
            firstVisitDate: new Date('2022-07-15T00:00:00.000Z'),
            houseHoldCoordinateId: null,
            lastChemicalUseDate: null,
            lastInspectionDate: null,
            organisation: 'mh',
            parentFacilityName: 'MAYIYI',
            plots: [
              expect.objectContaining({
                active: null,
                areaSizeManual: 1,
                areaSizeOrganicManual: 1,
                certificationStatus: null,
                cultivationStartDate: null,
                deletedAt: null,
                distanceToForest: null,
                distanceToForestKnown: null,
                establishedBefore2020: null,
                firestoreId: null,
                hasLandTitle: null,
                hasRightToLand: null,
                hasShadeTrees: null,
                interCropped: null,
                lastChemicalUseDate: null,
                name: 'MH-MYY-002-PLOT-1',
                ownerName: null,
                polygons: [],
                principalLeasesLand: null,
                principalOwnsLand: null,
                registrationDate: null,
                satelliteAnalysis: [],
                shortCode: 'MH-MYY-002-PLOT-1',
                status: null,
                traditionalOwners: null,
                traditionalOwnersPresent: null,
                type: 'Permanent',
                yieldEstimateProcessed: 1,
                yieldEstimateRaw: 5,
              }),
            ],
            surveyResults: [],
          }),
        );
      });
    });

    describe.skip('LTC Data Import', () => {
      it('Get unique fields', async () => {
        const result = await dataImportService.getDistinctValues();
        expect(result).toEqual({});
      });

      it.only(
        'Try to process LTC farm file',
        async () => {
          const result = await dataImportService.importLtcCsv();
          expect(result[0]).toEqual({
            contactPerson: expect.objectContaining({
              customFields: null,
              dateOfBirth: new Date('1980-12-10T00:00:00.000Z'),
              dateOfBirthApproximate: false,
              deletedAt: null,
              education: '',
              email: '',
              firstName: 'JOSTINA',
              gender: 'Female',
              identificationNumberType: 'NationalId',
              identificationNumber: 'CF8000310241DL',
              lastName: 'BUSABUTAMA',
              maritalStatus: 'Married',
              nickName: null,
              organisation: 'ltc',
              phone: '778418715',
              phone2: null,
              shortCode: 'TOK-0148',
              type: 'Farmer',
            }),
            plot: expect.objectContaining({
              active: null,
              areaSizeManual: 0,
              certificationStatus: null,
              cultivationStartDate: null,
              deletedAt: null,
              firestoreId: null,
              interCropped: null,
              lastChemicalUseDate: null,
              name: 'TOK-0148-PLOT-1',
              polygons: [
                expect.objectContaining({
                  active: true,
                  areaCalculated: new Prisma.Decimal(0.2075106579200657),
                  coordinates: [
                    ['30.0378108', '0.7307937'],
                    ['30.0379037', '0.7308515'],
                    ['30.0379992', '0.7309169'],
                    ['30.0380529', '0.7308923'],
                    ['30.0380806', '0.7308599'],
                    ['30.0380943', '0.7308331'],
                    ['30.038095', '0.73082'],
                    ['30.038095', '0.73082'],
                    ['30.0381725', '0.7307714'],
                    ['30.0382276', '0.7307321'],
                    ['30.0382854', '0.7306651'],
                    ['30.0383414', '0.7306404'],
                    ['30.0383156', '0.7305734'],
                    ['30.0382872', '0.7305637'],
                    ['30.0383018', '0.7305384'],
                    ['30.0382267', '0.7304993'],
                    ['30.038163', '0.7304353'],
                    ['30.038064', '0.7304171'],
                    ['30.0379582', '0.7304875'],
                    ['30.0378352', '0.7305629'],
                    ['30.0377797', '0.7306571'],
                    ['30.0378108', '0.7307937'],
                  ],
                  deletedAt: null,
                  shortCode: null,
                  source: 'IMPORT',
                  status: null,
                }),
              ],
              registrationDate: null,
              satelliteAnalysis: [],
              shortCode: 'TOK-0148-PLOT-1',
              status: 'IMPORTED',
              type: 'Permanent',
              yieldEstimateProcessed: null,
              yieldEstimateRaw: 1147,
            }),
            prismaFarm: expect.objectContaining({
              approvalStatus: 'InReview',
              certificationStartDate: null,
              certificationStatus: 'NotCertified',
              certifications: null,
              contractDate: new Date('2023-06-24T00:00:00.000Z'),
              creationStatus: null,
              deletedAt: null,
              firestoreId: null,
              firstVisitDate: null,
              houseHoldCoordinateId: null,
              lastChemicalUseDate: null,
              lastInspectionDate: null,
              organisation: 'ltc',
              registrationDate: new Date('2023-06-24T00:00:00.000Z'),
            }),
          });
        },
        60 * 1000,
      );
    });
  });
});
