"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FacilitiesController", {
    enumerable: true,
    get: function() {
        return FacilitiesController;
    }
});
const _common = require("@nestjs/common");
const _facilitiesservice = require("./facilities.service");
const _facilitiesdto = require("./dto/facilities.dto");
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
let FacilitiesController = class FacilitiesController {
    createFacility(org, body) {
        body.organisation = org;
        return this.facilityService.create(body);
    }
    updateFacility(org, id, body) {
        return this.facilityService.update(id, body);
    }
    deleteFacility(org, id) {
        return this.facilityService.delete(id);
    }
    getFacility(org, id) {
        return this.facilityService.getOne({
            id,
            org: org
        });
    }
    getFacilitys(org, params) {
        params.organisation = org;
        return this.facilityService.getMany({
            organisation: org,
            notFarm: params.notFarm
        });
    }
    constructor(facilityService){
        this.facilityService = facilityService;
    }
};
_ts_decorate([
    (0, _common.Post)(':org/facilities') // TODO: Mini thing, should we use plural or singular?
    ,
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _facilitiesdto.FacilitiesDto === "undefined" ? Object : _facilitiesdto.FacilitiesDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], FacilitiesController.prototype, "createFacility", null);
_ts_decorate([
    (0, _common.Patch)(':org/facilities/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        typeof _facilitiesdto.FacilitiesDto === "undefined" ? Object : _facilitiesdto.FacilitiesDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], FacilitiesController.prototype, "updateFacility", null);
_ts_decorate([
    (0, _common.Delete)(':org/facilities/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], FacilitiesController.prototype, "deleteFacility", null);
_ts_decorate([
    (0, _common.Get)(':org/facilities/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], FacilitiesController.prototype, "getFacility", null);
_ts_decorate([
    (0, _common.Get)(':org/facilities'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _facilitiesdto.FacilityFilterDto === "undefined" ? Object : _facilitiesdto.FacilityFilterDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], FacilitiesController.prototype, "getFacilitys", null);
FacilitiesController = _ts_decorate([
    (0, _common.Controller)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _facilitiesservice.FacilitiesService === "undefined" ? Object : _facilitiesservice.FacilitiesService
    ])
], FacilitiesController);
