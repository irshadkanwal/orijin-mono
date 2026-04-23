"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _core = require("@nestjs/core");
const _appForScriptsmodule = require("./appForScripts.module");
const _firestoreservice = require("../firestore/firestore.service");
const _nestjsprisma = require("nestjs-prisma");
const init = async ()=>{
    console.log('Testing testing');
    const context = await _core.NestFactory.createApplicationContext(_appForScriptsmodule.AppModuleForScripts);
    await context.init();
    const firestoreService = context.get(_firestoreservice.FirestoreService);
    const prismaService = context.get(_nestjsprisma.PrismaService);
    const farms = await prismaService.farm.findMany();
    console.log('Farms', farms);
    // TODO: Enable this to make the script actually run
    const result = await firestoreService.importFromFirestore('ltc_qa');
};
init();
