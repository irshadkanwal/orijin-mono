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
    AbstractCertificationsDto: function() {
        return AbstractCertificationsDto;
    },
    CertificationTypeDto: function() {
        return CertificationTypeDto;
    },
    CertificationsDto: function() {
        return CertificationsDto;
    },
    CertificationsDtoConnected: function() {
        return CertificationsDtoConnected;
    },
    CertificationsDtoCsv: function() {
        return CertificationsDtoCsv;
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
let CertificationTypeDto = class CertificationTypeDto {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CertificationTypeDto.prototype, "shortCode", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CertificationTypeDto.prototype, "name", void 0);
let AbstractCertificationsDto = class AbstractCertificationsDto {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], AbstractCertificationsDto.prototype, "shortCode", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], AbstractCertificationsDto.prototype, "status", void 0);
_ts_decorate([
    (0, _classvalidator.ValidateIf)((dto)=>typeof dto.certificationTypeCode === 'undefined' || dto.certificationTypeId && dto.certificationTypeCode),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], AbstractCertificationsDto.prototype, "certificationTypeId", void 0);
_ts_decorate([
    (0, _classvalidator.ValidateIf)((dto)=>typeof dto.certificationTypeId === 'undefined' || dto.certificationTypeId && dto.certificationTypeCode),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], AbstractCertificationsDto.prototype, "certificationTypeCode", void 0);
let CertificationsDto = class CertificationsDto extends AbstractCertificationsDto {
};
_ts_decorate([
    (0, _classvalidator.ValidateIf)((dto)=>typeof dto.farmCode === 'undefined' || dto.farmId && dto.farmCode),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CertificationsDto.prototype, "farmId", void 0);
_ts_decorate([
    (0, _classvalidator.ValidateIf)((dto)=>typeof dto.farmId === 'undefined' || dto.farmId && dto.farmCode),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CertificationsDto.prototype, "farmCode", void 0);
_ts_decorate([
    (0, _classvalidator.ValidateIf)((dto)=>typeof dto.plotCode === 'undefined' || dto.plotId && dto.plotCode),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CertificationsDto.prototype, "plotId", void 0);
_ts_decorate([
    (0, _classvalidator.ValidateIf)((dto)=>typeof dto.plotId === 'undefined' || dto.plotId && dto.plotCode),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CertificationsDto.prototype, "plotCode", void 0);
let CertificationsDtoCsv = class CertificationsDtoCsv extends AbstractCertificationsDto {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CertificationsDtoCsv.prototype, "organisation", void 0);
let CertificationsDtoConnected = class CertificationsDtoConnected extends CertificationsDto {
};
