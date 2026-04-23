"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LocationsController", {
    enumerable: true,
    get: function() {
        return LocationsController;
    }
});
const _common = require("@nestjs/common");
const _locationsservice = require("./locations.service");
const _locationsfilterdto = require("./dto/locations.filter.dto");
const _locationsdto = require("./dto/locations.dto");
const _farmsfilterdto = require("../farms/dto/farms.filter.dto");
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
let LocationsController = class LocationsController {
    postLocation(org, body) {
        return this.locationService.create({
            ...body,
            organisation: org
        });
    }
    updateLocation(org, id, body) {
        body.organisation = org;
        return this.locationService.update(id, body);
    }
    getLocations(org, filters) {
        filters.organisation = org;
        return this.locationService.getMany(filters);
    }
    getLocationsForFilters(org, filters) {
        filters.organisation = org;
        console.log('called: ', org);
        return this.locationService.getAllForFilterOptions(filters);
    }
    deleteLocation(org, id) {
        return this.locationService.delete(id);
    }
    getLocation(org, id, params) {
        return this.locationService.getOne({
            id,
            org: org
        });
    }
    getLocationsByType(org, filters) {
        return this.locationService.getFarmsPerLocation(org, filters);
    }
    getLocationsFilter(org, body) {
        const types = Array.isArray(body) ? body : [
            body
        ];
        return this.locationService.getCustomizedMany({
            OR: types.map((type)=>({
                    type
                }))
        });
    }
    getLocationsStats(org) {
        return this.locationService.getStats();
    }
    constructor(locationService){
        this.locationService = locationService;
    }
};
_ts_decorate([
    (0, _common.Post)(':org/locations'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        void 0
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], LocationsController.prototype, "postLocation", null);
_ts_decorate([
    (0, _common.Patch)(':org/locations/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        typeof _locationsdto.LocationsDto === "undefined" ? Object : _locationsdto.LocationsDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], LocationsController.prototype, "updateLocation", null);
_ts_decorate([
    (0, _common.Get)(':org/locations'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _locationsfilterdto.LocationsFilter === "undefined" ? Object : _locationsfilterdto.LocationsFilter
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], LocationsController.prototype, "getLocations", null);
_ts_decorate([
    (0, _common.Get)(':org/locations-filter'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _locationsfilterdto.LocationsFilter === "undefined" ? Object : _locationsfilterdto.LocationsFilter
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], LocationsController.prototype, "getLocationsForFilters", null);
_ts_decorate([
    (0, _common.Delete)(':org/locations/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], LocationsController.prototype, "deleteLocation", null);
_ts_decorate([
    (0, _common.Get)(':org/locations/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_param(2, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        typeof _locationsfilterdto.LocationsFilter === "undefined" ? Object : _locationsfilterdto.LocationsFilter
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], LocationsController.prototype, "getLocation", null);
_ts_decorate([
    (0, _common.Get)(':org/locationsByType'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _farmsfilterdto.FarmsFilter === "undefined" ? Object : _farmsfilterdto.FarmsFilter
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], LocationsController.prototype, "getLocationsByType", null);
_ts_decorate([
    (0, _common.Post)(':org/locationsFilterByType'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Array
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], LocationsController.prototype, "getLocationsFilter", null);
_ts_decorate([
    (0, _common.Get)(':org/location-stats'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], LocationsController.prototype, "getLocationsStats", null);
LocationsController = _ts_decorate([
    (0, _common.Controller)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _locationsservice.LocationsService === "undefined" ? Object : _locationsservice.LocationsService
    ])
], LocationsController);
