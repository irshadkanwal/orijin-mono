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
    CreateSupportServiceInputTypeDtoConnected: function() {
        return CreateSupportServiceInputTypeDtoConnected;
    },
    SupportServiceInputTypeDto: function() {
        return SupportServiceInputTypeDto;
    },
    SupportServiceInputTypeDtoCsv: function() {
        return SupportServiceInputTypeDtoCsv;
    },
    SupportServiceInputTypesFilterDto: function() {
        return SupportServiceInputTypesFilterDto;
    }
});
const _classvalidator = require("class-validator");
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
let AbstractDto = class AbstractDto {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], AbstractDto.prototype, "type", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], AbstractDto.prototype, "name", void 0);
let SupportServiceInputTypeDtoCsv = class SupportServiceInputTypeDtoCsv extends AbstractDto {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], SupportServiceInputTypeDtoCsv.prototype, "organisation", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], SupportServiceInputTypeDtoCsv.prototype, "shortCode", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], SupportServiceInputTypeDtoCsv.prototype, "supportingServiceCategoryCode", void 0);
let SupportServiceInputTypeDto = class SupportServiceInputTypeDto extends AbstractDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], SupportServiceInputTypeDto.prototype, "supportingServiceCategoryId", void 0);
let CreateSupportServiceInputTypeDtoConnected = class CreateSupportServiceInputTypeDtoConnected extends SupportServiceInputTypeDto {
};
let SupportServiceInputTypesFilterDto = class SupportServiceInputTypesFilterDto extends _paginationAndSortingdto.PaginationAndSortingDto {
};
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], SupportServiceInputTypesFilterDto.prototype, "shortCode", void 0);
