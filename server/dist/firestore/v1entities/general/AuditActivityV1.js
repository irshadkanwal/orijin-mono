"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return AuditActivityV1;
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
let AuditActivityV1 = class AuditActivityV1 extends _AbstractEntity.AbstractEntity {
    getCollection() {
        return _dbMappingUtils.collectionKeys.auditactivities;
    }
    setWorkFlowId(id) {
        this.id.workflowId = id;
    }
    setChainId(id) {
        this.id.chainId = id;
    }
    constructor(...args){
        super(...args);
        this.workFlowName = null;
        this.hasMovedToNext = false;
        this.workflowFinished = false;
        this.systemState = null;
        this.lastActivityName = null;
        this.processingProperties = new _ProcessingProperties.default();
        this.targetEntity = null;
        this.targetEntityParent = null;
        this.targetEntityFull = null;
        this.targetSubEntities = null;
        this.targetSubEntitiesFull = [];
        this.auditEntries = [];
        this.auditEntriesFull = [];
    }
};
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ProcessingProperties.default),
    _ts_metadata("design:type", typeof _ProcessingProperties.default === "undefined" ? Object : _ProcessingProperties.default)
], AuditActivityV1.prototype, "processingProperties", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], AuditActivityV1.prototype, "targetEntity", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], AuditActivityV1.prototype, "targetEntityParent", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    (0, _ormAnnotations.expandFromId)('targetEntity'),
    _ts_metadata("design:type", typeof _AbstractEntity.AbstractEntity === "undefined" ? Object : _AbstractEntity.AbstractEntity)
], AuditActivityV1.prototype, "targetEntityFull", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", Array)
], AuditActivityV1.prototype, "targetSubEntities", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    (0, _ormAnnotations.expandFromId)('targetSubEntities'),
    _ts_metadata("design:type", Array)
], AuditActivityV1.prototype, "targetSubEntitiesFull", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    (0, _ormAnnotations.cascadingDelete)(),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], AuditActivityV1.prototype, "auditEntries", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    (0, _ormAnnotations.expandFromId)('auditEntries'),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], AuditActivityV1.prototype, "auditEntriesFull", void 0);
