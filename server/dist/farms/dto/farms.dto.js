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
    CountItemDto: function() {
        return CountItemDto;
    },
    FarmInputValues: function() {
        return FarmInputValues;
    },
    FarmsDto: function() {
        return FarmsDto;
    },
    FarmsDtoCSv: function() {
        return FarmsDtoCSv;
    },
    PlotDto: function() {
        return PlotDto;
    },
    PlotDtoConnected: function() {
        return PlotDtoConnected;
    },
    PlotDtoCsv: function() {
        return PlotDtoCsv;
    }
});
const _classvalidator = require("class-validator");
const _farmsmodel = require("../models/farms.model");
const _classtransformer = require("class-transformer");
const _plotsmodel = require("../models/plots.model");
const _facilitiesdto = require("../../facilities/dto/facilities.dto");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let FarmInputValues = class FarmInputValues {
};
let CountItemDto = class CountItemDto {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", typeof _farmsmodel.CountCategory === "undefined" ? Object : _farmsmodel.CountCategory)
], CountItemDto.prototype, "category", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", typeof _farmsmodel.CountType === "undefined" ? Object : _farmsmodel.CountType)
], CountItemDto.prototype, "type", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", Number)
], CountItemDto.prototype, "count", void 0);
let FarmsDtoCSv = class FarmsDtoCSv extends _facilitiesdto.FacilitiesDtoCsv {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], FarmsDtoCSv.prototype, "organisation", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], FarmsDtoCSv.prototype, "shortCode", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], FarmsDtoCSv.prototype, "seasonCode", void 0);
let FarmsDto = class FarmsDto {
};
_ts_decorate([
    (0, _classvalidator.ValidateNested)(),
    (0, _classtransformer.Type)(()=>FarmInputValues),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", typeof FarmInputValues === "undefined" ? Object : FarmInputValues)
], FarmsDto.prototype, "farmValues", void 0);
_ts_decorate([
    (0, _classvalidator.ValidateNested)(),
    (0, _classtransformer.Type)(()=>_facilitiesdto.FacilitiesDto),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", typeof _facilitiesdto.FacilitiesDto === "undefined" ? Object : _facilitiesdto.FacilitiesDto)
], FarmsDto.prototype, "facilityValues", void 0);
let PlotDto = class PlotDto {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], PlotDto.prototype, "organisation", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], PlotDto.prototype, "shortCode", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], PlotDto.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", typeof _plotsmodel.PlotType === "undefined" ? Object : _plotsmodel.PlotType)
], PlotDto.prototype, "type", void 0);
let PlotDtoCsv = class PlotDtoCsv {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], PlotDtoCsv.prototype, "organisation", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], PlotDtoCsv.prototype, "shortCode", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], PlotDtoCsv.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", typeof _plotsmodel.PlotType === "undefined" ? Object : _plotsmodel.PlotType)
], PlotDtoCsv.prototype, "type", void 0);
let PlotDtoConnected = class PlotDtoConnected extends PlotDto {
};
