"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SeasonsController", {
    enumerable: true,
    get: function() {
        return SeasonsController;
    }
});
const _common = require("@nestjs/common");
const _seasonsservice = require("./seasons.service");
const _paginationAndSortingdto = require("../common/dto/paginationAndSorting.dto");
const _seasonsdto = require("./dto/seasons.dto");
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
let SeasonsController = class SeasonsController {
    createSeason(org, body) {
        body.organisation = org;
        return this.seasonService.create(body);
    }
    updateSeason(org, id, body) {
        return this.seasonService.update(id, body);
    }
    deleteSeason(org, id) {
        return this.seasonService.delete(id);
    }
    getSeason(org, id) {
        return this.seasonService.getOne({
            id,
            org: org
        });
    }
    getSeasons(org, params) {
        params.organisation = org;
        return this.seasonService.getMany({
            organisation: org,
            sort: params.sort ?? 'shortCode'
        });
    }
    constructor(seasonService){
        this.seasonService = seasonService;
    }
};
_ts_decorate([
    (0, _common.Post)(':org/seasons') // TODO: Mini thing, should we use plural or singular?
    ,
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _seasonsdto.SeasonsDto === "undefined" ? Object : _seasonsdto.SeasonsDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], SeasonsController.prototype, "createSeason", null);
_ts_decorate([
    (0, _common.Patch)(':org/seasons/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        typeof _seasonsdto.SeasonsDto === "undefined" ? Object : _seasonsdto.SeasonsDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], SeasonsController.prototype, "updateSeason", null);
_ts_decorate([
    (0, _common.Delete)(':org/seasons/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], SeasonsController.prototype, "deleteSeason", null);
_ts_decorate([
    (0, _common.Get)(':org/seasons/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], SeasonsController.prototype, "getSeason", null);
_ts_decorate([
    (0, _common.Get)(':org/seasons'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _paginationAndSortingdto.StandardFilterDto === "undefined" ? Object : _paginationAndSortingdto.StandardFilterDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], SeasonsController.prototype, "getSeasons", null);
SeasonsController = _ts_decorate([
    (0, _common.Controller)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _seasonsservice.SeasonsService === "undefined" ? Object : _seasonsservice.SeasonsService
    ])
], SeasonsController);
