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
    CreateSupportServiceActivityDto: function() {
        return CreateSupportServiceActivityDto;
    },
    CreateSupportServiceActivityDtoConnected: function() {
        return CreateSupportServiceActivityDtoConnected;
    },
    CreateSupportServiceActivityDtoCsv: function() {
        return CreateSupportServiceActivityDtoCsv;
    }
});
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
let AbstractDto = class AbstractDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], AbstractDto.prototype, "description", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], AbstractDto.prototype, "beneficiaryType", void 0);
let CreateSupportServiceActivityDtoCsv = class CreateSupportServiceActivityDtoCsv extends AbstractDto {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateSupportServiceActivityDtoCsv.prototype, "organisation", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateSupportServiceActivityDtoCsv.prototype, "shortCode", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateSupportServiceActivityDtoCsv.prototype, "operator", void 0);
_ts_decorate([
    (0, _classvalidator.IsDateString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateSupportServiceActivityDtoCsv.prototype, "dateOfService", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateSupportServiceActivityDtoCsv.prototype, "supportingServiceCategoryCode", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateSupportServiceActivityDtoCsv.prototype, "supportingServiceActivityTypeCode", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateSupportServiceActivityDtoCsv.prototype, "locationCode", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateSupportServiceActivityDtoCsv.prototype, "description", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateSupportServiceActivityDtoCsv.prototype, "supportingServiceCategoryTypeCode", void 0);
let CreateSupportServiceActivityDto = class CreateSupportServiceActivityDto extends AbstractDto {
};
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateSupportServiceActivityDto.prototype, "organisation", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateSupportServiceActivityDto.prototype, "operator", void 0);
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsString)({
        each: true
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Array)
], CreateSupportServiceActivityDto.prototype, "farmerGroupIds", void 0);
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsString)({
        each: true
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Array)
], CreateSupportServiceActivityDto.prototype, "personIds", void 0);
_ts_decorate([
    (0, _classvalidator.IsDateString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], CreateSupportServiceActivityDto.prototype, "dateOfService", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateSupportServiceActivityDto.prototype, "supportingServiceCategoryId", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateSupportServiceActivityDto.prototype, "supportingServiceActivityTypeId", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateSupportServiceActivityDto.prototype, "locationId", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateSupportServiceActivityDto.prototype, "description", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateSupportServiceActivityDto.prototype, "supportingServiceCategoryTypeId", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], CreateSupportServiceActivityDto.prototype, "itemsProcessed", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], CreateSupportServiceActivityDto.prototype, "itemValue", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], CreateSupportServiceActivityDto.prototype, "score", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], CreateSupportServiceActivityDto.prototype, "total", void 0);
let CreateSupportServiceActivityDtoConnected = class CreateSupportServiceActivityDtoConnected extends CreateSupportServiceActivityDto {
};
