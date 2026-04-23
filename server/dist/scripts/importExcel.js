"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _core = require("@nestjs/core");
const _appForScriptsmodule = require("./appForScripts.module");
const _ltcdataImportservice = require("../dataImports/ltc.dataImport.service");
const _mhdataImportservice = require("../dataImports/mh.dataImport.service");
const _lyondataImportservice = require("../dataImports/lyon.dataImport.service");
const _nestjsprisma = require("nestjs-prisma");
const _kokoaKamilidataImportservice = require("../dataImports/kokoaKamili.dataImport.service");
const _mhRawdataImportservice = require("../dataImports/mhRaw.dataImport.service");
const _nahuadataImportservice = require("../dataImports/nahua.dataImport.service");
const _mainutils = require("../main.utils");
const init = async ()=>{
    const context = await _core.NestFactory.createApplicationContext(_appForScriptsmodule.AppModuleForScripts, {
        logger: [
            'error',
            'warn',
            'log'
        ]
    });
    await context.init();
    (0, _mainutils.logStartup)();
    const prisma = context.get(_nestjsprisma.PrismaService);
    const ltcDataImport = context.get(_ltcdataImportservice.LtcDataImportService);
    const mhDataImportService = context.get(_mhdataImportservice.MhDataImportService);
    const mhRawData = context.get(_mhRawdataImportservice.MhRawDataImportService);
    const lyonDataImportService = context.get(_lyondataImportservice.LyonDataImportService);
    const kamiliImport = context.get(_kokoaKamilidataImportservice.KokoaKamiliDataImportService);
    const nahuaImport = context.get(_nahuadataImportservice.NahuaDataImportService);
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
