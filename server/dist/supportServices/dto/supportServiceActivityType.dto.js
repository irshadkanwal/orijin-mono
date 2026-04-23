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
    CreateSupportServiceActivityTypeDtoConnected: function() {
        return CreateSupportServiceActivityTypeDtoConnected;
    },
    SupportServiceActivityTypeDto: function() {
        return SupportServiceActivityTypeDto;
    },
    SupportServiceActivityTypeDtoCsv: function() {
        return SupportServiceActivityTypeDtoCsv;
    },
    SupportServiceActivityTypesFilterDto: function() {
        return SupportServiceActivityTypesFilterDto;
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
_ts_decorate([
    (0, _classvalidator.IsEnum)([
        'INDIVIDUAL',
        'GROUP'
    ]),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], AbstractDto.prototype, "beneficiaryType", void 0);
let SupportServiceActivityTypeDtoCsv = class SupportServiceActivityTypeDtoCsv extends AbstractDto {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], SupportServiceActivityTypeDtoCsv.prototype, "organisation", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], SupportServiceActivityTypeDtoCsv.prototype, "shortCode", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], SupportServiceActivityTypeDtoCsv.prototype, "supportingServiceCategoryCode", void 0);
let SupportServiceActivityTypeDto = class SupportServiceActivityTypeDto extends AbstractDto {
};
let CreateSupportServiceActivityTypeDtoConnected = class CreateSupportServiceActivityTypeDtoConnected extends SupportServiceActivityTypeDto {
};
let SupportServiceActivityTypesFilterDto = class SupportServiceActivityTypesFilterDto extends _paginationAndSortingdto.PaginationAndSortingDto {
};
