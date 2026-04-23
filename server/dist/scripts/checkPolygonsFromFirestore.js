"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _core = require("@nestjs/core");
const _appForScriptsmodule = require("./appForScripts.module");
const _firestoreservice = require("../firestore/firestore.service");
const init = async ()=>{
    console.log('== Get latest polygons from Firestore == ');
    const context = await _core.NestFactory.createApplicationContext(_appForScriptsmodule.AppModuleForScripts);
    await context.init();
    const firestoreService = context.get(_firestoreservice.FirestoreService);
    // const prismaService = context.get<PrismaService>(PrismaService);
    // const farms = await prismaService.farm.findMany();
    // console.log('Farms', farms);
    await firestoreService.importPolygonsFromFirestore('ltc_test24');
};
init();
