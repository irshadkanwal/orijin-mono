"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _core = require("@nestjs/core");
const _appForScriptsmodule = require("./appForScripts.module");
const _firestoreExporterservice = require("../firestore/export/firestoreExporter.service");
const _client = require("@prisma/client");
const _seedMain = require("../common/seed/seedMain");
const _exportToFirestoreUtils = require("./exportToFirestoreUtils");
const _importCsvUtils = require("./importCsvUtils");
const _dataImportservice = require("../dataImports/dataImport.service");
const init = async ()=>{
    console.log('== Export toFirestore == ');
    const context = await _core.NestFactory.createApplicationContext(_appForScriptsmodule.AppModuleForScripts);
    await context.init();
    const firestoreExporterService = context.get(_firestoreExporterservice.FirestoreExporterService);
    const dataImportService = context.get(_dataImportservice.DataImportService);
    // const org = 'kerem';
    // const org = 'seed';
    const org = 'latitude';
    // const workspace = 'kerem_master';
    const workspace = 'latitude_salla';
    // const workspace = 'seed_test';
    const prisma = new _client.PrismaClient();
    await (0, _seedMain.emptyDatabase)(prisma);
    await dataImportService.importAll((0, _importCsvUtils.getCsvImportItems)(org), `/test/in/${(0, _importCsvUtils.getCsvImportFolder)(org)}/`, org);
    const result = await firestoreExporterService.exportAll({
        organisation: org,
        workspace: workspace,
        configKey: 'ltc',
        onlyCreate: false
    }, (0, _exportToFirestoreUtils.getFirestoreExportItems)(org));
};
init();
