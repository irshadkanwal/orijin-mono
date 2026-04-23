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
    CreateRuleDto: function() {
        return CreateRuleDto;
    },
    UpdateRuleDto: function() {
        return UpdateRuleDto;
    }
});
const _client = require("@prisma/client");
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
let CreateRuleDto = class CreateRuleDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateRuleDto.prototype, "category", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateRuleDto.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateRuleDto.prototype, "functionCode", void 0);
_ts_decorate([
    (0, _classvalidator.IsEnum)(_client.FunctionTypes, {
        message: 'functionType must be a valid enum value'
    }),
    _ts_metadata("design:type", typeof _client.FunctionTypes === "undefined" ? Object : _client.FunctionTypes)
], CreateRuleDto.prototype, "functionType", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], CreateRuleDto.prototype, "commonThreshold", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateRuleDto.prototype, "countryAdjustments", void 0);
let UpdateRuleDto = class UpdateRuleDto {
};
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], UpdateRuleDto.prototype, "category", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], UpdateRuleDto.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], UpdateRuleDto.prototype, "functionCode", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], UpdateRuleDto.prototype, "commonThreshold", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], UpdateRuleDto.prototype, "countryAdjustments", void 0);
