"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _core = require("@nestjs/core");
const _appForScriptsmodule = require("./appForScripts.module");
const _nestjsprisma = require("nestjs-prisma");
const _plotsservice = require("../farms/plots.service");
const _geopolygonservice = require("../geodatas/geopolygon.service");
const _common = require("@nestjs/common");
const init = async ()=>{
    const context = await _core.NestFactory.createApplicationContext(_appForScriptsmodule.AppModuleForScripts);
    await context.init();
    //constants required for filtering
    const org = 'ltc';
    const logger = new _common.Logger('script');
    const prismaService = context.get(_nestjsprisma.PrismaService);
    const plotsService = context.get(_plotsservice.PlotsService);
    const polygonService = context.get(_geopolygonservice.PolygonService);
    const activeSeason = await prismaService.season.findFirst({
        where: {
            active: true
        }
    });
    const seasonID = activeSeason.id;
    logger.log('activeSeason', activeSeason);
    // delete existing interaction Warnings
    await prismaService.polygonInteractionWarning.deleteMany({
        where: {
            polygons: {
                every: {
                    plot: {
                        is: {
                            farm: {
                                is: {
                                    organisation: org,
                                    season: {
                                        id: seasonID
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    //get active polygon and create warnings
    const activePolygons = await polygonService.getAllActivePolygonsForOrgAndSeason(org, seasonID);
    for (const polygon of activePolygons){
        await plotsService.createInteractionWarningsForPolygons(polygon, seasonID, org, [], polygon.plot.shortCode);
    }
};
init();
