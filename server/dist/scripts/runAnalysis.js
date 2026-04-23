"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _core = require("@nestjs/core");
const _appForScriptsmodule = require("./appForScripts.module");
const _farmstatsservice = require("../farms/farm.stats.service");
const init = async ()=>{
    const context = await _core.NestFactory.createApplicationContext(_appForScriptsmodule.AppModuleForScripts);
    await context.init();
    const farmStatsService = context.get(_farmstatsservice.FarmStatsService);
    const args = process.argv.slice(2);
    console.log('Args', args);
    const results = await farmStatsService.getStats({
        organisation: 'ltc'
    });
    console.log(JSON.stringify(results, null, 4));
};
init();
