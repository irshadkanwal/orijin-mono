"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "VesselsController", {
    enumerable: true,
    get: function() {
        return VesselsController;
    }
});
const _common = require("@nestjs/common");
const _vesselsservice = require("./vessels.service");
const _paginationAndSortingdto = require("../common/dto/paginationAndSorting.dto");
const _vesselsdto = require("./dto/vessels.dto");
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
let VesselsController = class VesselsController {
    createVessel(org, body) {
        body.organisation = org;
        return this.vesselService.create(body);
    }
    updateVessel(org, id, body) {
        return this.vesselService.update(id, body);
    }
    deleteVessel(org, id) {
        return this.vesselService.delete(id);
    }
    getVessel(org, id) {
        return this.vesselService.getOne({
            id,
            org: org
        });
    }
    getVessels(org, filters) {
        filters.organisation = org;
        return this.vesselService.getMany(filters);
    }
    constructor(vesselService){
        this.vesselService = vesselService;
    }
};
_ts_decorate([
    (0, _common.Post)(':org/vessels') // TODO: Mini thing, should we use plural or singular?
    ,
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _vesselsdto.VesselsDto === "undefined" ? Object : _vesselsdto.VesselsDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], VesselsController.prototype, "createVessel", null);
_ts_decorate([
    (0, _common.Patch)(':org/vessels/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        typeof _vesselsdto.VesselsDto === "undefined" ? Object : _vesselsdto.VesselsDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], VesselsController.prototype, "updateVessel", null);
_ts_decorate([
    (0, _common.Delete)(':org/vessels/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], VesselsController.prototype, "deleteVessel", null);
_ts_decorate([
    (0, _common.Get)(':org/vessels/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], VesselsController.prototype, "getVessel", null);
_ts_decorate([
    (0, _common.Get)(':org/vessels'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _paginationAndSortingdto.StandardFilterDto === "undefined" ? Object : _paginationAndSortingdto.StandardFilterDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], VesselsController.prototype, "getVessels", null);
VesselsController = _ts_decorate([
    (0, _common.Controller)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _vesselsservice.VesselsService === "undefined" ? Object : _vesselsservice.VesselsService
    ])
], VesselsController);
