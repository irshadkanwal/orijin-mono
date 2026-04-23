"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _core = require("@nestjs/core");
const _appForScriptsmodule = require("./appForScripts.module");
const _firestoreExporterservice = require("../firestore/export/firestoreExporter.service");
const _exportToFirestoreUtils = require("./exportToFirestoreUtils");
const init = async ()=>{
    console.log('== Export toFirestore == ');
    const context = await _core.NestFactory.createApplicationContext(_appForScriptsmodule.AppModuleForScripts);
    await context.init();
    const firestoreExporterService = context.get(_firestoreExporterservice.FirestoreExporterService);
    // const org = 'latitude';
    const org = 'seed';
    const workspace = 'seed_test';
    const result = await firestoreExporterService.exportAll({
        organisation: org,
        workspace: workspace,
        configKey: 'ltc',
        onlyCreate: false
    }, (0, _exportToFirestoreUtils.getFirestoreExportItems)(org));
};
init();
