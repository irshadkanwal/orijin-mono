"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return QualityControlResultSubmission;
    }
});
const _classtransformer = require("class-transformer");
const _ObjectId = require("../utis/ObjectId");
const _AbstractEntity = require("../utis/AbstractEntity");
const _dbMappingUtils = require("../../v1utils/dbMappingUtils");
const _QualityControlResultSubmissionItem = /*#__PURE__*/ _interop_require_default(require("./QualityControlResultSubmissionItem"));
const _ProcessingProperties = /*#__PURE__*/ _interop_require_default(require("../production/ProcessingProperties"));
const _utils = require("../../v1utils/utils");
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
let QualityControlResultSubmission = class QualityControlResultSubmission extends _AbstractEntity.AbstractEntity {
    getCollection() {
        return _dbMappingUtils.collectionKeys.qualitycontrolresultsubmissions;
    }
    constructor(...args){
        super(...args);
        this.qualityControlSessionId = null;
        this.qualityControlResultsId = null;
        this.referenceObjectId = null;
        this.sheetId = null;
        this.submissions = [];
        this.score = null;
        this.notes = null;
        this.evaluator = null;
        this.processingProperties = new _ProcessingProperties.default();
        this.startDate = null;
        this.endDate = null;
    }
};
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], QualityControlResultSubmission.prototype, "qualityControlSessionId", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], QualityControlResultSubmission.prototype, "qualityControlResultsId", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], QualityControlResultSubmission.prototype, "referenceObjectId", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_QualityControlResultSubmissionItem.default),
    _ts_metadata("design:type", Array)
], QualityControlResultSubmission.prototype, "submissions", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ProcessingProperties.default),
    _ts_metadata("design:type", typeof _ProcessingProperties.default === "undefined" ? Object : _ProcessingProperties.default)
], QualityControlResultSubmission.prototype, "processingProperties", void 0);
_ts_decorate([
    (0, _classtransformer.Transform)(({ value })=>(0, _utils.formatDatesForFS)(value)),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], QualityControlResultSubmission.prototype, "startDate", void 0);
_ts_decorate([
    (0, _classtransformer.Transform)(({ value })=>(0, _utils.formatDatesForFS)(value)),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], QualityControlResultSubmission.prototype, "endDate", void 0);
