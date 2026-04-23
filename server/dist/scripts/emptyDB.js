"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _core = require("@nestjs/core");
const _appForScriptsmodule = require("./appForScripts.module");
const _nestjsprisma = require("nestjs-prisma");
const _seedMain = require("../common/seed/seedMain");
const init = async ()=>{
    const context = await _core.NestFactory.createApplicationContext(_appForScriptsmodule.AppModuleForScripts);
    await context.init();
    const prismaService = context.get(_nestjsprisma.PrismaService);
    const result = await (0, _seedMain.emptyDatabase)(prismaService);
};
init();
