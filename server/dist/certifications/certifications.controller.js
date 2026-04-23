"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CertificationsController", {
    enumerable: true,
    get: function() {
        return CertificationsController;
    }
});
const _common = require("@nestjs/common");
const _certificationsservice = require("./certifications.service");
const _certificationTypeservice = require("./certificationType.service");
const _paginationAndSortingdto = require("../common/dto/paginationAndSorting.dto");
const _certificationsdto = require("./dto/certifications.dto");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let CertificationsController = class CertificationsController {
    getAllCertificateType(org, filters) {
        filters.organisation = org;
        return this.certificationTypeService.getMany(filters);
    }
    getCertificateType(org, id) {
        return this.certificationTypeService.getOne({
            id,
            org: org
        });
    }
    createCertificateType(org, body) {
        body.organisation = org;
        return this.certificationTypeService.create(body);
    }
    deleteCertificateType(org, id) {
        return this.certificationTypeService.delete(id);
    }
    constructor(certificationService, certificationTypeService){
        this.certificationService = certificationService;
        this.certificationTypeService = certificationTypeService;
    }
};
_ts_decorate([
    (0, _common.Get)(':org/certification-types'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _paginationAndSortingdto.StandardFilterDto === "undefined" ? Object : _paginationAndSortingdto.StandardFilterDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], CertificationsController.prototype, "getAllCertificateType", null);
_ts_decorate([
    (0, _common.Get)(':org/certification-types/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], CertificationsController.prototype, "getCertificateType", null);
_ts_decorate([
    (0, _common.Post)(':org/certification-types') // TODO: Mini thing, should we use plural or singular?
    ,
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _certificationsdto.CertificationTypeDto === "undefined" ? Object : _certificationsdto.CertificationTypeDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], CertificationsController.prototype, "createCertificateType", null);
_ts_decorate([
    (0, _common.Delete)(':org/certification-types/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], CertificationsController.prototype, "deleteCertificateType", null);
CertificationsController = _ts_decorate([
    (0, _common.Controller)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _certificationsservice.CertificationsService === "undefined" ? Object : _certificationsservice.CertificationsService,
        typeof _certificationTypeservice.CertificationTypeService === "undefined" ? Object : _certificationTypeservice.CertificationTypeService
    ])
], CertificationsController);
