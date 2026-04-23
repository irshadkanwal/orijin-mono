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
    PaginationAndSortingDto: function() {
        return PaginationAndSortingDto;
    },
    PaginationAndSortingOutputDto: function() {
        return PaginationAndSortingOutputDto;
    },
    StandardFilterDto: function() {
        return StandardFilterDto;
    }
});
const _prismahelper = require("../prisma.helper");
const _classvalidator = require("class-validator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let PaginationAndSortingOutputDto = class PaginationAndSortingOutputDto {
};
let PaginationAndSortingDto = class PaginationAndSortingDto {
};
_ts_decorate([
    (0, _prismahelper.FilterType)('text'),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], PaginationAndSortingDto.prototype, "page", void 0);
_ts_decorate([
    (0, _prismahelper.FilterType)('text'),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], PaginationAndSortingDto.prototype, "limit", void 0);
_ts_decorate([
    (0, _prismahelper.FilterType)('text'),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], PaginationAndSortingDto.prototype, "order", void 0);
_ts_decorate([
    (0, _prismahelper.FilterType)('text'),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], PaginationAndSortingDto.prototype, "sort", void 0);
_ts_decorate([
    (0, _prismahelper.FilterType)('text'),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], PaginationAndSortingDto.prototype, "sortOrder", void 0);
let StandardFilterDto = class StandardFilterDto extends PaginationAndSortingDto {
};
_ts_decorate([
    (0, _prismahelper.FilterType)('text'),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], StandardFilterDto.prototype, "name", void 0);
_ts_decorate([
    (0, _prismahelper.FilterType)('text'),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], StandardFilterDto.prototype, "shortCode", void 0);
_ts_decorate([
    (0, _prismahelper.FilterType)('text'),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], StandardFilterDto.prototype, "organisation", void 0);
