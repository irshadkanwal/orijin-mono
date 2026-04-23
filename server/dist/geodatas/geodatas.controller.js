"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GeodatasController", {
    enumerable: true,
    get: function() {
        return GeodatasController;
    }
});
const _common = require("@nestjs/common");
const _geopolygonservice = require("./geopolygon.service");
const _geodatasDto = require("./dto/geodatasDto");
const _paginationAndSortingdto = require("../common/dto/paginationAndSorting.dto");
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
let GeodatasController = class GeodatasController {
    postGeoData(org, body) {
        body.organisation = org;
        return this.geoPolygonService.create(body);
    }
    getVarieties(org, filters) {
        filters.organisation = org;
        return this.geoPolygonService.getMany(filters);
    }
    getGeoData(org, id) {
        return this.geoPolygonService.getOne({
            id,
            org
        });
    }
    updateGeoData(body, id) {
        const { active } = body;
        return this.geoPolygonService.updatePolygon(id, {
            active
        });
    }
    constructor(geoPolygonService){
        this.geoPolygonService = geoPolygonService;
    }
};
_ts_decorate([
    (0, _common.Post)(':org/geopolygons'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _geodatasDto.PolygonDto === "undefined" ? Object : _geodatasDto.PolygonDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], GeodatasController.prototype, "postGeoData", null);
_ts_decorate([
    (0, _common.Get)(':org/geopolygons'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _paginationAndSortingdto.StandardFilterDto === "undefined" ? Object : _paginationAndSortingdto.StandardFilterDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], GeodatasController.prototype, "getVarieties", null);
_ts_decorate([
    (0, _common.Get)(':org/geopolygons/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], GeodatasController.prototype, "getGeoData", null);
_ts_decorate([
    (0, _common.Patch)('geopolygons/:id'),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _geodatasDto.PolygonDto === "undefined" ? Object : _geodatasDto.PolygonDto,
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], GeodatasController.prototype, "updateGeoData", null);
GeodatasController = _ts_decorate([
    (0, _common.Controller)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _geopolygonservice.PolygonService === "undefined" ? Object : _geopolygonservice.PolygonService
    ])
], GeodatasController);
