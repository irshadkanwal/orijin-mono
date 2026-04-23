"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return AuditEntryV1;
    }
});
const _dbMappingUtils = require("../../v1utils/dbMappingUtils");
const _classtransformer = require("class-transformer");
const _ObjectId = require("../utis/ObjectId");
const _AbstractEntity = require("../utis/AbstractEntity");
const _ormAnnotations = require("../../v1utils/ormAnnotations");
const _ProcessingProperties = /*#__PURE__*/ _interop_require_default(require("../production/ProcessingProperties"));
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
let AuditEntryV1 = class AuditEntryV1 extends _AbstractEntity.AbstractEntity {
    getCollection() {
        return _dbMappingUtils.collectionKeys.auditentries;
    }
    constructor(...args){
        super(...args);
        this.systemState = null;
        this.processingProperties = new _ProcessingProperties.default();
        this.referenceObjectId = null;
        this.referenceObjectFull = null;
        this.previousVersionObjectId = null;
        this.previousVersionObjectFull = null;
        this.referenceObjectIds = null;
        this.parentAuditActivity = null;
    }
};
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ProcessingProperties.default),
    _ts_metadata("design:type", typeof _ProcessingProperties.default === "undefined" ? Object : _ProcessingProperties.default)
], AuditEntryV1.prototype, "processingProperties", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], AuditEntryV1.prototype, "referenceObjectId", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    (0, _ormAnnotations.expandFromId)('referenceObjectId'),
    _ts_metadata("design:type", typeof _AbstractEntity.AbstractEntity === "undefined" ? Object : _AbstractEntity.AbstractEntity)
], AuditEntryV1.prototype, "referenceObjectFull", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], AuditEntryV1.prototype, "previousVersionObjectId", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    (0, _ormAnnotations.expandFromId)('previousVersionObjectId'),
    _ts_metadata("design:type", typeof _AbstractEntity.AbstractEntity === "undefined" ? Object : _AbstractEntity.AbstractEntity)
], AuditEntryV1.prototype, "previousVersionObjectFull", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", Array)
], AuditEntryV1.prototype, "referenceObjectIds", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], AuditEntryV1.prototype, "parentAuditActivity", void 0);
