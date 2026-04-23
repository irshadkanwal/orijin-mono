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
    CreateSupportServiceCategoryDto: function() {
        return CreateSupportServiceCategoryDto;
    },
    CreateSupportServiceCategoryDtoConnected: function() {
        return CreateSupportServiceCategoryDtoConnected;
    },
    CreateSupportServiceCategoryDtoCsv: function() {
        return CreateSupportServiceCategoryDtoCsv;
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
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], AbstractDto.prototype, "shortCode", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], AbstractDto.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", Object)
], AbstractDto.prototype, "description", void 0);
let CreateSupportServiceCategoryDtoCsv = class CreateSupportServiceCategoryDtoCsv extends AbstractDto {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateSupportServiceCategoryDtoCsv.prototype, "organisation", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateSupportServiceCategoryDtoCsv.prototype, "supportingServiceCategoryTypeCode", void 0);
let CreateSupportServiceCategoryDto = class CreateSupportServiceCategoryDto extends AbstractDto {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateSupportServiceCategoryDto.prototype, "supportingServiceCategoryTypeId", void 0);
let CreateSupportServiceCategoryDtoConnected = class CreateSupportServiceCategoryDtoConnected extends CreateSupportServiceCategoryDto {
};
