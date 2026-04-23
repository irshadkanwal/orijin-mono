"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FarmsController", {
    enumerable: true,
    get: function() {
        return FarmsController;
    }
});
const _common = require("@nestjs/common");
const _farmsservice = require("./farms.service");
const _plotsservice = require("./plots.service");
const _countItemservice = require("./countItem.service");
const _farmsdto = require("./dto/farms.dto");
const _farmstatsservice = require("./farm.stats.service");
const _farmsfilterdto = require("./dto/farms.filter.dto");
const _seasonsservice = require("../seasons/seasons.service");
const _plotsfilterdto = require("./dto/plots.filter.dto");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let FarmsController = class FarmsController {
    // Plot count - is this used?
    // @Post('countitems')
    // postCountItem(@Body() body): Promise<CountItem> {
    //   return this.plotCountItemService.create(body);
    // }
    getPlotsCountItem() {
        return this.plotCountItemService.getAll();
    }
    getCountItem(id) {
        return this.plotCountItemService.getOne(id);
    }
    // Plots
    postPlot(body) {
        return this.plotsService.upsert(body);
    }
    // Polygons
    autofixAndStore(body) {
        return this.plotsService.autofixAndStorePolygons(body.polygonCoordinates, body.polygonSource, body.plotShortCode);
    }
    getPlot(org, id) {
        // TODO: Confirm that the org is the same as the parent farm
        return this.plotsService.getOne(id);
    }
    getVessels(org, filters) {
        filters.organisation = org;
        return this.plotsService.getMany(filters);
    }
    // Farms
    postFarm(body) {
        return this.farmService.create(body);
    }
    getFarmsOrg(org, filters) {
        filters.organisation = org;
        return this.farmService.getMany(filters);
    }
    getFarmsOrgMinimal(org, filters) {
        filters.organisation = org;
        return this.farmService.getManyImpl(filters, {
            minimalData: true
        });
    }
    getFarmOrg(org, id) {
        return this.farmService.getOne({
            id,
            org
        });
    }
    async getFarmStats(org, filters) {
        filters.organisation = org;
        return this.farmStatsService.getStats(filters);
    }
    async getFarmSeasons(org, id) {
        const currentFarm = await this.farmService.getOne({
            id,
            org
        });
        const seasons = await this.seasonService.getMany({
            organisation: org,
            sort: 'shortCode'
        });
        return Promise.all(seasons.data.map((s)=>this.farmService.getOne({
                org,
                shortCode: currentFarm.facility.shortCode,
                seasonId: s.id
            }).then((maybeSeasonFarm)=>({
                    seasonId: s.id,
                    seasonCode: s.shortCode,
                    farmId: maybeSeasonFarm?.id
                }))));
    }
    async getFarmSeasonsHistory(org, id) {
        const currentFarm = await this.farmService.getOne({
            id,
            org
        });
        const seasons = await this.seasonService.getMany({
            organisation: org,
            sort: 'shortCode'
        });
        return Promise.all(seasons.data.map((s)=>this.farmService.getOne({
                org,
                shortCode: currentFarm.facility.shortCode,
                seasonId: s.id
            }).then((maybeSeasonFarm)=>({
                    seasonId: s.id,
                    seasonCode: s.shortCode,
                    farm: maybeSeasonFarm
                }))));
    }
    constructor(farmService, plotsService, plotCountItemService, farmStatsService, seasonService){
        this.farmService = farmService;
        this.plotsService = plotsService;
        this.plotCountItemService = plotCountItemService;
        this.farmStatsService = farmStatsService;
        this.seasonService = seasonService;
        this.logger = new _common.Logger(FarmsController.name);
    }
};
_ts_decorate([
    (0, _common.Get)('countitems'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], FarmsController.prototype, "getPlotsCountItem", null);
_ts_decorate([
    (0, _common.Get)('countitems/:id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], FarmsController.prototype, "getCountItem", null);
_ts_decorate([
    (0, _common.Post)('plots'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _farmsdto.PlotDto === "undefined" ? Object : _farmsdto.PlotDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], FarmsController.prototype, "postPlot", null);
_ts_decorate([
    (0, _common.Post)('autofix-polygons'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], FarmsController.prototype, "autofixAndStore", null);
_ts_decorate([
    (0, _common.Get)(':org/plots/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], FarmsController.prototype, "getPlot", null);
_ts_decorate([
    (0, _common.Get)(':org/plots'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _plotsfilterdto.PlotsFilter === "undefined" ? Object : _plotsfilterdto.PlotsFilter
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], FarmsController.prototype, "getVessels", null);
_ts_decorate([
    (0, _common.Post)('farms'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _farmsdto.FarmsDto === "undefined" ? Object : _farmsdto.FarmsDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], FarmsController.prototype, "postFarm", null);
_ts_decorate([
    (0, _common.Get)(':org/farms'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _farmsfilterdto.FarmsFilter === "undefined" ? Object : _farmsfilterdto.FarmsFilter
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], FarmsController.prototype, "getFarmsOrg", null);
_ts_decorate([
    (0, _common.Get)(':org/farms-minimal'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _farmsfilterdto.FarmsFilter === "undefined" ? Object : _farmsfilterdto.FarmsFilter
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], FarmsController.prototype, "getFarmsOrgMinimal", null);
_ts_decorate([
    (0, _common.Get)(':org/farms/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], FarmsController.prototype, "getFarmOrg", null);
_ts_decorate([
    (0, _common.Get)(':org/farm-stats'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _farmsfilterdto.FarmsFilter === "undefined" ? Object : _farmsfilterdto.FarmsFilter
    ]),
    _ts_metadata("design:returntype", Promise)
], FarmsController.prototype, "getFarmStats", null);
_ts_decorate([
    (0, _common.Get)(':org/farm/seasons/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], FarmsController.prototype, "getFarmSeasons", null);
_ts_decorate([
    (0, _common.Get)(':org/farm/season/history/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], FarmsController.prototype, "getFarmSeasonsHistory", null);
FarmsController = _ts_decorate([
    (0, _common.Controller)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _farmsservice.FarmsService === "undefined" ? Object : _farmsservice.FarmsService,
        typeof _plotsservice.PlotsService === "undefined" ? Object : _plotsservice.PlotsService,
        typeof _countItemservice.CountItemService === "undefined" ? Object : _countItemservice.CountItemService,
        typeof _farmstatsservice.FarmStatsService === "undefined" ? Object : _farmstatsservice.FarmStatsService,
        typeof _seasonsservice.SeasonsService === "undefined" ? Object : _seasonsservice.SeasonsService
    ])
], FarmsController);
