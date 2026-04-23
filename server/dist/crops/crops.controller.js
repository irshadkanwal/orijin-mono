"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CropsController", {
    enumerable: true,
    get: function() {
        return CropsController;
    }
});
const _common = require("@nestjs/common");
const _cropsservice = require("./crops.service");
const _cropvarietyservice = require("./cropvariety.service");
const _cropsdto = require("./dto/crops.dto");
const _paginationAndSortingdto = require("../common/dto/paginationAndSorting.dto");
const _cropsdto1 = require("./dto/crops.dto");
const _cropsfilterdto = require("./dto/crops.filter.dto");
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
let CropsController = class CropsController {
    createCrop(org, body) {
        body.organisation = org;
        return this.cropService.create(body);
    }
    updateCrop(org, id, body) {
        return this.cropService.update(id, body);
    }
    deleteCrop(org, id) {
        return this.cropService.delete(id);
    }
    getCrop(org, id) {
        return this.cropService.getOne({
            id,
            org: org
        });
    }
    getCrops(org, filters) {
        filters.organisation = org;
        return this.cropService.getMany(filters);
    }
    createCropVariety(org, body) {
        body.organisation = org;
        return this.cropVarietyService.create(body);
    }
    updateCropVariety(org, id, body) {
        return this.cropVarietyService.update(id, body);
    }
    deleteCropVariety(org, id) {
        return this.cropVarietyService.delete(id);
    }
    getCropVariety(org, id) {
        return this.cropVarietyService.getOne({
            id,
            org: org
        });
    }
    getCropVarieties(org, params) {
        params.organisation = org;
        return this.cropVarietyService.getMany(params);
    }
    constructor(cropService, cropVarietyService){
        this.cropService = cropService;
        this.cropVarietyService = cropVarietyService;
    }
};
_ts_decorate([
    (0, _common.Post)(':org/crops') // TODO: Mini thing, should we use plural or singular?
    ,
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _cropsdto1.CropsDto === "undefined" ? Object : _cropsdto1.CropsDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], CropsController.prototype, "createCrop", null);
_ts_decorate([
    (0, _common.Patch)(':org/crops/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        typeof _cropsdto1.CropsDto === "undefined" ? Object : _cropsdto1.CropsDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], CropsController.prototype, "updateCrop", null);
_ts_decorate([
    (0, _common.Delete)(':org/crops/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], CropsController.prototype, "deleteCrop", null);
_ts_decorate([
    (0, _common.Get)(':org/crops/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], CropsController.prototype, "getCrop", null);
_ts_decorate([
    (0, _common.Get)(':org/crops'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _paginationAndSortingdto.StandardFilterDto === "undefined" ? Object : _paginationAndSortingdto.StandardFilterDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], CropsController.prototype, "getCrops", null);
_ts_decorate([
    (0, _common.Post)(':org/crop-varieties') // TODO: Mini thing, should we use plural or singular?
    ,
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _cropsdto.CropVarietyDto === "undefined" ? Object : _cropsdto.CropVarietyDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], CropsController.prototype, "createCropVariety", null);
_ts_decorate([
    (0, _common.Patch)(':org/crop-varieties/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        typeof _cropsdto.CropVarietyDto === "undefined" ? Object : _cropsdto.CropVarietyDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], CropsController.prototype, "updateCropVariety", null);
_ts_decorate([
    (0, _common.Delete)(':org/crop-varieties/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], CropsController.prototype, "deleteCropVariety", null);
_ts_decorate([
    (0, _common.Get)(':org/crop-varieties/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], CropsController.prototype, "getCropVariety", null);
_ts_decorate([
    (0, _common.Get)(':org/crop-varieties'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _cropsfilterdto.CropVarietyFilter === "undefined" ? Object : _cropsfilterdto.CropVarietyFilter
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], CropsController.prototype, "getCropVarieties", null);
CropsController = _ts_decorate([
    (0, _common.Controller)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _cropsservice.CropsService === "undefined" ? Object : _cropsservice.CropsService,
        typeof _cropvarietyservice.CropvarietyService === "undefined" ? Object : _cropvarietyservice.CropvarietyService
    ])
], CropsController);
