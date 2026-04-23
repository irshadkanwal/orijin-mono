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
    AbstractCertificationType: function() {
        return AbstractCertificationType;
    },
    CertificationTypeDto: function() {
        return CertificationTypeDto;
    },
    CertificationTypeDtoCsv: function() {
        return CertificationTypeDtoCsv;
    },
    CertificationsDto: function() {
        return CertificationsDto;
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
let AbstractCertificationType = class AbstractCertificationType {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], AbstractCertificationType.prototype, "shortCode", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], AbstractCertificationType.prototype, "name", void 0);
let CertificationTypeDto = class CertificationTypeDto extends AbstractCertificationType {
};
let CertificationTypeDtoCsv = class CertificationTypeDtoCsv extends AbstractCertificationType {
};
let CertificationsDto = class CertificationsDto {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CertificationsDto.prototype, "status", void 0);
