import { INestApplication } from '@nestjs/common';
import { createTestingModuleWithPrisma } from './test-util';
import { FirestoreService } from '../src/firestore/firestore.service';
import { FirestoreModule } from '../src/firestore/firestore.module';
import { FarmsService } from '../src/farms/farms.service';
import { Farm } from '../src/farms/models/farms.model';

describe('Firestore Import Service (e2e)', () => {
  let app: INestApplication;
  let firestoreService: FirestoreService;
  let farmsService: FarmsService;

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
    farmsService = initialized.moduleFixture.get<FarmsService>(FarmsService);
  });

  /**
   * Keep as Skip!
   *
   * Remember to enable override from .env.tests after working with these!
   */
  describe.skip('Firestore LIVE', () => {
    it.skip('Try to get allowed organizations for a token', async () => {
      if (!process.env.FIREBASE_PROJECT_ID) {
        console.log('No firebase project ID, skipping');
        return;
      }
      const allowed = await firestoreService.getAllowedOrganizations(
        'TQL1bwid2MQJDwUiyz9FaeuzpwC2',
      );
      expect(allowed).toEqual(['latitude', 'tma', 'verapaz', 'otc', 'mh']);
    });

    it.skip(
      'Try to process Firestore data',
      async () => {
        if (!process.env.FIREBASE_PROJECT_ID) {
          console.log('No firebase project ID, skipping');
          return;
        }

        const result = await firestoreService.importFromFirestore('ltc_master'); // 'mh_salla' for dev

        // 1- Seasons
        expect(result.importedSeasons.length).toEqual(4);
        expect(result.importedSeasons[0]).toEqual(
          expect.objectContaining({
            name: '2023/24',
            organisation: 'ltc',
          }),
        );

        // 2 - Locations
        expect(result.importedLocations[0]).toEqual(
          expect.objectContaining({
            name: 'KAGADI',
            type: 'District',
            organisation: 'ltc',
          }),
        );
        // expect(result.importedLocations.length).toEqual(171);

        // 3 - Farms
        // Using farmService to confirm all relations too
        // const farmsCreated = 1;
        // expect(result.importedFarms.length).toEqual(farmsCreated);
        const farms: Farm[] = (await farmsService.getMany()).data as Farm[];
        // expect(farms.length).toEqual(farmsCreated);
        expect(farms[0]).toEqual(
          expect.objectContaining({
            approvalStatus: 'NeedsReview',
            certificationStartDate: null,
            certificationStatus: 'NotCertified',
            certifications: null,
            contractDate: null,
            creationStatus: 'NotSet',
            cultivationStartDate: null,
            deletedAt: null,
            firestoreId: '4b299c39-c35c-4c8e-b702-bc48e0f0a354',
            firstVisitDate: null,
            houseHoldCoordinateId: null,
            lastChemicalUseDate: null,
            lastInspectionDate: null,
            organisation: 'ltc',
            registrationDate: null,
            shortCode: '123',
            facility: expect.objectContaining({
              shortCode: 'BTC-0643',
              location: expect.objectContaining({
                name: 'BUGANIKERE TOWN COUNCIL',
                shortCode: 'BTC',
              }),
            }),
            plots: [
              expect.objectContaining({
                active: null,
                areaSizeManual: null,
                certificationStatus: null,
                cultivationStartDate: null,
                deletedAt: null,
                firestoreId: null,
                interCropped: null,
                lastChemicalUseDate: null,
                name: 'p1',
                organisation: 'mh',
              }),
            ],
            // varieties: [],
          }),
        );
      },
      30 * 1000,
    );
  });
});
