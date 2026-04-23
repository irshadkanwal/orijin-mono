"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _core = require("@nestjs/core");
const _appForScriptsmodule = require("./appForScripts.module");
const _dataImportservice = require("../dataImports/dataImport.service");
const _seedMain = require("../common/seed/seedMain");
const _client = require("@prisma/client");
const init = async ()=>{
    const context = await _core.NestFactory.createApplicationContext(_appForScriptsmodule.AppModuleForScripts);
    await context.init();
    const dataImportService = context.get(_dataImportservice.DataImportService);
    // const org = 'mh';
    const org = 'seed';
    const prisma = new _client.PrismaClient();
    //should do this for org Only!!!!
    await (0, _seedMain.emptyDatabase)(prisma);
};
init();
