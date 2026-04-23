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
    AbstractCropVarietyDto: function() {
        return AbstractCropVarietyDto;
    },
    CropVarietyDto: function() {
        return CropVarietyDto;
    },
    CropVarietyDtoConnected: function() {
        return CropVarietyDtoConnected;
    },
    CropVarietyDtoCsv: function() {
        return CropVarietyDtoCsv;
    },
    CropsDto: function() {
        return CropsDto;
    },
    CropsDtoCsv: function() {
        return CropsDtoCsv;
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
let CropsDtoCsv = class CropsDtoCsv {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CropsDtoCsv.prototype, "organisation", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CropsDtoCsv.prototype, "shortCode", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CropsDtoCsv.prototype, "name", void 0);
let CropsDto = class CropsDto {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", Object)
], CropsDto.prototype, "shortCode", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CropsDto.prototype, "name", void 0);
let AbstractCropVarietyDto = class AbstractCropVarietyDto {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], AbstractCropVarietyDto.prototype, "shortCode", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], AbstractCropVarietyDto.prototype, "name", void 0);
let CropVarietyDtoCsv = class CropVarietyDtoCsv extends AbstractCropVarietyDto {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CropVarietyDtoCsv.prototype, "cropCode", void 0);
let CropVarietyDtoConnected = class CropVarietyDtoConnected extends AbstractCropVarietyDto {
};
let CropVarietyDto = class CropVarietyDto extends AbstractCropVarietyDto {
};
_ts_decorate([
    (0, _classvalidator.ValidateIf)((dto)=>typeof dto.cropCode === 'undefined' || dto.cropId && dto.cropCode),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CropVarietyDto.prototype, "cropId", void 0);
_ts_decorate([
    (0, _classvalidator.ValidateIf)((dto)=>typeof dto.cropId === 'undefined' || dto.cropId && dto.cropCode),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CropVarietyDto.prototype, "cropCode", void 0);
