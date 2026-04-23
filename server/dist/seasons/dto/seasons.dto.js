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
    AbstractSeasonsDto: function() {
        return AbstractSeasonsDto;
    },
    SeasonsDto: function() {
        return SeasonsDto;
    },
    SeasonsDtoCsv: function() {
        return SeasonsDtoCsv;
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
let AbstractSeasonsDto = class AbstractSeasonsDto {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], AbstractSeasonsDto.prototype, "shortCode", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], AbstractSeasonsDto.prototype, "name", void 0);
let SeasonsDtoCsv = class SeasonsDtoCsv extends AbstractSeasonsDto {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], SeasonsDtoCsv.prototype, "organisation", void 0);
let SeasonsDto = class SeasonsDto extends AbstractSeasonsDto {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], SeasonsDto.prototype, "startsAt", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", Boolean)
], SeasonsDto.prototype, "active", void 0);
