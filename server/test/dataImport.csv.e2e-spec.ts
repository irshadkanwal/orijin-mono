import { INestApplication } from '@nestjs/common';
import { createTestingModuleWithPrisma } from './test-util';
import { FarmsService } from '../src/farms/farms.service';
import { DataImportsModule } from '../src/dataImports/dataImports.module';
import { PrismaClient } from '@prisma/client';
import { FileReaderService } from '../src/dataImports/fileReader.service';
import { DataImportService } from '../src/dataImports/dataImport.service';
import { emptyDatabase } from '../src/common/seed/seedMain';
import {
  getCsvImportFolder,
  getCsvImportItems,
} from '../src/scripts/importCsvUtils';

jest.setTimeout(60 * 1000);

describe('Data Import Service CSV (e2e)', () => {
  let app: INestApplication;
  let farmsService: FarmsService;
  let dataImportService: DataImportService;
  let fileReaderService: FileReaderService;

  beforeEach(async () => {
    const initialized = await createTestingModuleWithPrisma({
      imports: [DataImportsModule],
      providers: [],
    });
    app = initialized.app;
    farmsService = initialized.moduleFixture.get<FarmsService>(FarmsService);
    dataImportService =
      initialized.moduleFixture.get<DataImportService>(DataImportService);
    fileReaderService =
      initialized.moduleFixture.get<FileReaderService>(FileReaderService);
  });

  describe('CSV Data import tests', () => {
    it(
      'CSV',
      async () => {
        const prisma = new PrismaClient();
        await emptyDatabase(prisma);

        const org = 'seed';
        // const org = 'seed';
        // const org = 'ltc';
        // const org = 'latitude';

        await dataImportService.importAll(
          getCsvImportItems(org),
          `/test/in/${getCsvImportFolder(org)}/`,
          org,
        );
      },
      60 * 1000,
    );
  });
});
