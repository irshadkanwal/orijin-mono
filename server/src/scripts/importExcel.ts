import { NestFactory } from '@nestjs/core';
import { AppModuleForScripts } from './appForScripts.module';
import { LtcDataImportService } from '../dataImports/ltc.dataImport.service';
import { MhDataImportService } from '../dataImports/mh.dataImport.service';
import { LyonDataImportService } from '../dataImports/lyon.dataImport.service';
// import { seedServices } from '../../prisma/seed/seedServices';
import { PrismaService } from 'nestjs-prisma';
import { KokoaKamiliDataImportService } from '../dataImports/kokoaKamili.dataImport.service';
import { MhRawDataImportService } from '../dataImports/mhRaw.dataImport.service';
import { NahuaDataImportService } from '../dataImports/nahua.dataImport.service';
import { logStartup } from '../main.utils';

const init = async () => {
  const context = await NestFactory.createApplicationContext(
    AppModuleForScripts,
    {
      logger: [
        'error', //
        'warn',
        'log',
        // 'debug'
      ],
    },
  );
  await context.init();
  logStartup();

  const prisma = context.get<PrismaService>(PrismaService);
  const ltcDataImport = context.get<LtcDataImportService>(LtcDataImportService);
  const mhDataImportService =
    context.get<MhDataImportService>(MhDataImportService);
  const mhRawData = context.get<MhRawDataImportService>(MhRawDataImportService);
  const lyonDataImportService = context.get<LyonDataImportService>(
    LyonDataImportService,
  );
  const kamiliImport = context.get<KokoaKamiliDataImportService>(
    KokoaKamiliDataImportService,
  );
  const nahuaImport = context.get<NahuaDataImportService>(
    NahuaDataImportService,
  );

  const args = process.argv.slice(2);
  console.log('Args', args);

  /////////////////////
  // Under work
  /////////////////////

  await mhRawData.importMHRawFormat(9999);

  /////////////////////
  // Import history below!
  /////////////////////

  // 12.9.2024 Kamili import again to fix polygon's order
  // await kamiliImport.importKamili();

  // 11.9.2024
  // await nahuaImport.importNahua();

  // Re-import of original "MH -5" file to include the missed 200 farms
  // await mhDataImportService.importMh();

  // About week 33 or 34
  // await kamiliImport.importKamili();

  // 17.7.2024 - Imported
  // await seedServices(
  //   prisma.supportingServiceCategoryType,
  //   prisma.supportingServiceCategory,
  //   'mh',
  // );

  // 17.7.2024 - The Create-version done, but only 611 farms got imported due to connection pool
  // await mhDataImportService.importMh();

  // xx.x.2024 - Lyon Agro data imported to Prod
  // await lyonDataImportService.importLyon();

  // xx.x.2024 - LTC data imported to Prod
  // await ltcDataImport.importLtcCsv();
};

init();
