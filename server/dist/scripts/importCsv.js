"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _core = require("@nestjs/core");
const _appForScriptsmodule = require("./appForScripts.module");
const _dataImportservice = require("../dataImports/dataImport.service");
const _importCsvUtils = require("./importCsvUtils");
const init = async ()=>{
    const context = await _core.NestFactory.createApplicationContext(_appForScriptsmodule.AppModuleForScripts);
    await context.init();
    const dataImportService = context.get(_dataImportservice.DataImportService);
    // const org = 'mh';
    const org = 'seed';
    // const org = 'seed';
    // const org = 'latitude';
    await dataImportService.importAll((0, _importCsvUtils.getCsvImportItems)(org), `/test/in/${(0, _importCsvUtils.getCsvImportFolder)(org)}/`, org);
};
init();
