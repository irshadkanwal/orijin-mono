"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _core = require("@nestjs/core");
const _appForScriptsmodule = require("./appForScripts.module");
const _farmsservice = require("../farms/farms.service");
const _common = require("@nestjs/common");
const _geocledianservice = require("../geocledian/geocledian.service");
const init = async ()=>{
    const context = await _core.NestFactory.createApplicationContext(_appForScriptsmodule.AppModuleForScripts, {
        logger: [
            'error',
            'warn',
            'log'
        ]
    });
    await context.init();
    const logger = new _common.Logger('analysePolygons');
    const geoCledianService = context.get(_geocledianservice.GeocledianService);
    const farmsService = context.get(_farmsservice.FarmsService);
    const organisation = 'kamili';
    const farms = await farmsService.getMany({
        organisation
    });
    for (const farm of farms.data){
        logger.log('----');
        logger.log('Starting farm ' + farm.facility.shortCode);
        for (const plot of farm.plots){
            await geoCledianService.getAndStoreAnalysisResponse(plot.id, organisation);
        }
    }
};
init();
