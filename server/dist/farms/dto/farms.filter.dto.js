"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FarmsFilter", {
    enumerable: true,
    get: function() {
        return FarmsFilter;
    }
});
const _classvalidator = require("class-validator");
const _prismahelper = require("../../common/prisma.helper");
const _paginationAndSortingdto = require("../../common/dto/paginationAndSorting.dto");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let FarmsFilter = class FarmsFilter extends _paginationAndSortingdto.PaginationAndSortingDto {
};
_ts_decorate([
    (0, _prismahelper.FilterType)('text'),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], FarmsFilter.prototype, "organisation", void 0);
_ts_decorate([
    (0, _prismahelper.FilterType)('text'),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], FarmsFilter.prototype, "text", void 0);
_ts_decorate([
    (0, _prismahelper.FilterType)('text', 'ID...'),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], FarmsFilter.prototype, "shortCode", void 0);
_ts_decorate([
    (0, _prismahelper.FilterType)('faceted', undefined, 'Location'),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], FarmsFilter.prototype, "location", void 0);
_ts_decorate([
    (0, _prismahelper.FilterType)('faceted', undefined, 'Farmer group'),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], FarmsFilter.prototype, "customLocation", void 0);
_ts_decorate([
    (0, _prismahelper.FilterType)('text'),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], FarmsFilter.prototype, "name", void 0);
_ts_decorate([
    (0, _prismahelper.FilterType)('text'),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], FarmsFilter.prototype, 'facility.name', void 0);
_ts_decorate([
    (0, _prismahelper.FilterType)('text'),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], FarmsFilter.prototype, "description", void 0);
_ts_decorate([
    (0, _prismahelper.FilterType)('select', undefined, 'Season code'),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], FarmsFilter.prototype, "seasonCode", void 0);
_ts_decorate([
    (0, _prismahelper.FilterType)('select', undefined, 'Polygons'),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], FarmsFilter.prototype, "polygonStatus", void 0);
_ts_decorate([
    (0, _prismahelper.FilterType)('select', undefined, 'Deforestation'),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], FarmsFilter.prototype, "deforestation", void 0);
