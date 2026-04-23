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
    AbstractVesselsDto: function() {
        return AbstractVesselsDto;
    },
    VesselsDto: function() {
        return VesselsDto;
    },
    VesselsDtoConnected: function() {
        return VesselsDtoConnected;
    },
    VesselsDtoCsv: function() {
        return VesselsDtoCsv;
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
let AbstractVesselsDto = class AbstractVesselsDto {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], AbstractVesselsDto.prototype, "shortCode", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], AbstractVesselsDto.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], AbstractVesselsDto.prototype, "type", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], AbstractVesselsDto.prototype, "subType", void 0);
let VesselsDtoCsv = class VesselsDtoCsv extends AbstractVesselsDto {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], VesselsDtoCsv.prototype, "organisation", void 0);
let VesselsDto = class VesselsDto extends AbstractVesselsDto {
};
_ts_decorate([
    (0, _classvalidator.ValidateIf)((dto)=>typeof dto.plotCode === 'undefined' || dto.plotId && dto.plotCode),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], VesselsDto.prototype, "plotId", void 0);
_ts_decorate([
    (0, _classvalidator.ValidateIf)((dto)=>typeof dto.plotId === 'undefined' || dto.plotId && dto.plotCode),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], VesselsDto.prototype, "plotCode", void 0);
_ts_decorate([
    (0, _classvalidator.ValidateIf)((dto)=>typeof dto.facilityCode === 'undefined' || dto.facilityId && dto.facilityCode),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], VesselsDto.prototype, "facilityId", void 0);
_ts_decorate([
    (0, _classvalidator.ValidateIf)((dto)=>typeof dto.facilityId === 'undefined' || dto.facilityId && dto.facilityCode),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], VesselsDto.prototype, "facilityCode", void 0);
let VesselsDtoConnected = class VesselsDtoConnected extends VesselsDto {
};
