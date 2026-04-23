"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    AbstractDto: function() {
        return AbstractDto;
    },
    FacilitiesDto: function() {
        return FacilitiesDto;
    },
    FacilitiesDtoCsv: function() {
        return FacilitiesDtoCsv;
    },
    FacilityFilterDto: function() {
        return FacilityFilterDto;
    },
    GeoCoordinateInput: function() {
        return GeoCoordinateInput;
    }
});
const _classvalidator = require("class-validator");
const _facilitymodel = require("../models/facility.model");
const _paginationAndSortingdto = require("../../common/dto/paginationAndSorting.dto");
const _prismahelper = require("../../common/prisma.helper");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AbstractDto = class AbstractDto {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], AbstractDto.prototype, "shortCode", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], AbstractDto.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", typeof _facilitymodel.FacilityType === "undefined" ? Object : _facilitymodel.FacilityType)
], AbstractDto.prototype, "type", void 0);
let FacilitiesDtoCsv = class FacilitiesDtoCsv extends AbstractDto {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], FacilitiesDtoCsv.prototype, "organisation", void 0);
let FacilitiesDto = class FacilitiesDto extends AbstractDto {
};
let FacilityFilterDto = class FacilityFilterDto extends _paginationAndSortingdto.StandardFilterDto {
};
_ts_decorate([
    (0, _prismahelper.FilterType)("boolean"),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], FacilityFilterDto.prototype, "notFarm", void 0);
let GeoCoordinateInput = class GeoCoordinateInput {
};
