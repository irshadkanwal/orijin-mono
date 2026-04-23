"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FirestoreCertificationTypeExporterService", {
    enumerable: true,
    get: function() {
        return FirestoreCertificationTypeExporterService;
    }
});
const _common = require("@nestjs/common");
const _AbstractExporter = require("./AbstractExporter");
const _utils = require("../v1utils/utils");
const _OrmProvider = /*#__PURE__*/ _interop_require_default(require("../v1services/OrmProvider"));
const _certificationTypeservice = require("../../certifications/certificationType.service");
const _CertificationTypeV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/certification/CertificationTypeV1"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let FirestoreCertificationTypeExporterService = class FirestoreCertificationTypeExporterService extends _AbstractExporter.AbstractExporter {
    async transform(input, meta) {
        const res = new _CertificationTypeV1.default();
        (0, _utils.setupIdFields)(res, input, meta);
        res.name = input.name;
        res.id.label = input.name;
        res.id.labelShort = input.shortCode;
        return res;
    }
    constructor(firestoreService, myService){
        super(firestoreService, myService);
        this.firestoreService = firestoreService;
        this.myService = myService;
        this.logger = new _common.Logger(FirestoreCertificationTypeExporterService.name);
    }
};
FirestoreCertificationTypeExporterService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _OrmProvider.default === "undefined" ? Object : _OrmProvider.default,
        typeof _certificationTypeservice.CertificationTypeService === "undefined" ? Object : _certificationTypeservice.CertificationTypeService
    ])
], FirestoreCertificationTypeExporterService);
