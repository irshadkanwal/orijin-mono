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
    AbstractPolygonDto: function() {
        return AbstractPolygonDto;
    },
    GeoPolygonValues: function() {
        return GeoPolygonValues;
    },
    GeodatasDto: function() {
        return GeodatasDto;
    },
    PatchPolygonDto: function() {
        return PatchPolygonDto;
    },
    PolygonDto: function() {
        return PolygonDto;
    },
    PolygonDtoConnected: function() {
        return PolygonDtoConnected;
    },
    PolygonDtoCsv: function() {
        return PolygonDtoCsv;
    }
});
const _swagger = require("@nestjs/swagger");
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
let GeoPolygonValues = class GeoPolygonValues {
};
let GeodatasDto = class GeodatasDto {
};
let PatchPolygonDto = class PatchPolygonDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classvalidator.IsBoolean)(),
    _ts_metadata("design:type", Boolean)
], PatchPolygonDto.prototype, "active", void 0);
let AbstractPolygonDto = class AbstractPolygonDto {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], AbstractPolygonDto.prototype, "shortCode", void 0);
let PolygonDto = class PolygonDto extends AbstractPolygonDto {
};
_ts_decorate([
    (0, _classvalidator.ValidateIf)((dto)=>typeof dto.plotCode === 'undefined' || dto.plotId && dto.plotCode),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], PolygonDto.prototype, "plotId", void 0);
_ts_decorate([
    (0, _classvalidator.ValidateIf)((dto)=>typeof dto.plotId === 'undefined' || dto.plotId && dto.plotCode),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], PolygonDto.prototype, "plotCode", void 0);
let PolygonDtoCsv = class PolygonDtoCsv extends AbstractPolygonDto {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], PolygonDtoCsv.prototype, "organisation", void 0);
let PolygonDtoConnected = class PolygonDtoConnected extends PolygonDto {
};
