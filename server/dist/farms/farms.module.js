"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FarmsModule", {
    enumerable: true,
    get: function() {
        return FarmsModule;
    }
});
const _common = require("@nestjs/common");
const _facilitiesmodule = require("../facilities/facilities.module");
const _polygonUtilmodule = require("../polygonUtil/polygonUtil.module");
const _countItemservice = require("./countItem.service");
const _farmstatsservice = require("./farm.stats.service");
const _farmscontroller = require("./farms.controller");
const _farmsservice = require("./farms.service");
const _plotsservice = require("./plots.service");
const _farmfilters = require("./farm.filters");
const _changesmodule = require("../changes/changes.module");
const _geodatasmodule = require("../geodatas/geodatas.module");
const _seasonsservice = require("../seasons/seasons.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let FarmsModule = class FarmsModule {
};
FarmsModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _facilitiesmodule.FacilitiesModule,
            _polygonUtilmodule.PolygonUtilModule,
            _changesmodule.ChangesModule,
            _geodatasmodule.GeodatasModule
        ],
        controllers: [
            _farmscontroller.FarmsController
        ],
        providers: [
            _farmsservice.FarmsService,
            _farmstatsservice.FarmStatsService,
            _plotsservice.PlotsService,
            _countItemservice.CountItemService,
            _farmfilters.FarmFilters,
            _seasonsservice.SeasonsService
        ],
        exports: [
            _farmsservice.FarmsService,
            _plotsservice.PlotsService
        ]
    })
], FarmsModule);
