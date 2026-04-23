import { INestApplication } from '@nestjs/common';
import { createTestingModuleWithPrisma } from './test-util';
import { FarmsService } from '../src/farms/farms.service';
import { DataImportsModule } from '../src/dataImports/dataImports.module';
import { DataImportService } from '../src/dataImports/dataImport.service';
import OrmProvider from '../src/firestore/v1services/OrmProvider';
import AccountV1 from '../src/firestore/v1entities/org/AccountV1';
import { FirestoreModule } from '../src/firestore/firestore.module';
import { ObjectId } from '../src/firestore/v1entities/utis/ObjectId';
import { FirestoreService } from '../src/firestore/firestore.service';
import WorkspaceV1 from '../src/firestore/v1entities/org/WorkspaceV1';
import CropV1 from '../src/firestore/v1entities/refdata/CropV1';
import WorkspaceProvider from '../src/firestore/v1services/WorkspaceProvider';
import OrganisationProvider from '../src/firestore/v1services/OrganisationProvider';
import OrganisationV1 from '../src/firestore/v1entities/org/OrganisationV1';

jest.setTimeout(60 * 1000);

describe.skip('V1 data tests', () => {
  let app: INestApplication;
  let farmsService: FarmsService;
  let dataImportService: DataImportService;
  let ormProvider: OrmProvider;
  let workspaceProvider: WorkspaceProvider;
  let organisationProvider: OrganisationProvider;

  let firestoreService: FirestoreService;

  beforeEach(async () => {
    const initialized = await createTestingModuleWithPrisma({
      imports: [DataImportsModule, FirestoreModule],
      providers: [],
    });
    app = initialized.app;

    firestoreService =
      initialized.moduleFixture.get<FirestoreService>(FirestoreService);

    ormProvider = initialized.moduleFixture.get<OrmProvider>(OrmProvider);
    organisationProvider =
      initialized.moduleFixture.get<OrganisationProvider>(OrganisationProvider);

    workspaceProvider =
      initialized.moduleFixture.get<WorkspaceProvider>(WorkspaceProvider);
  });

  describe('V1 data', () => {
    it(
      'V1 data test',
      async () => {
        if (!process.env.FIREBASE_PROJECT_ID) {
          throw Error('no firebase project');
        }

        const currentUser = {
          id: '05K89nwBNGWV4BKIW29OFKrl8m02',
          refcollection: 'baseusers',
        } as ObjectId;
        const ops = {
          organisation: 'ltc',
          configKey: 'ltc',
          currentUser: currentUser,
          workspace: 'ltc_salla',
        };

        // const org = await organisationProvider.createOrganisation(
        //   'testorg',
        //   'testorg',
        //   {
        //     currentUser,
        //   },
        // );

        const org = await ormProvider.getById('testorg', OrganisationV1);
        const account = await ormProvider.getById(
          '05K89nwBNGWV4BKIW29OFKrl8m02',
          AccountV1,
        );

        // const ws = await workspaceProvider.createWorkspace(
        //   'test',
        //   'ltc',
        //   currentUser,
        //   org.id.id + '_test',
        //   ops,
        // );
        const ws = await ormProvider.getById(org.id.id + '_test', WorkspaceV1);
        const wss = await workspaceProvider.getWorkspace({
          id: org.id.id + '_test',
          refcollection: 'workspaces',
        } as ObjectId);

        const baseUser: AccountV1 = await ormProvider.getById(
          '05K89nwBNGWV4BKIW29OFKrl8m02',
          AccountV1,
          ops,
        );
        console.log('baseUser', baseUser);

        const tx = ormProvider.getTransaction();

        await workspaceProvider.addWorkspaceUser(ws.id, baseUser.id, {
          tx,
          currentUser,
        });

        //this method is really bad as it required the full objects are params...!!!
        await workspaceProvider.addWorkspaceUserRole(
          {
            workspace: ws,
            role: 'BuyingOfficerAll',
            name: account.name,
            user: account,
          },
          ops,
        );
        await ormProvider.commit(tx);

        const workspaces: WorkspaceV1[] = await ormProvider.getAll(
          'workspaces',
          ops,
        );
        console.log('workspaces', workspaces);

        const crops: CropV1[] = (
          await ormProvider.searchBy(CropV1, {
            filters: [
              {
                key: 'name',
                operation: '==',
                value: 'Cocoa',
              },
            ],
            ops,
          })
        ).values;

        console.log('crops', crops);
      },
      60 * 1000,
    );
  });
});
