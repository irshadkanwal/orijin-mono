"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return QualityControlSession;
    }
});
const _classtransformer = require("class-transformer");
const _ObjectId = require("../utis/ObjectId");
const _dbMappingUtils = require("../../v1utils/dbMappingUtils");
const _utils = require("../../v1utils/utils");
const _AbstractLot = /*#__PURE__*/ _interop_require_default(require("../production/AbstractLot"));
const _types = require("../utis/types");
const _ormAnnotations = require("../../v1utils/ormAnnotations");
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
let QualityControlSession = class QualityControlSession extends _AbstractLot.default {
    getCollection() {
        return _dbMappingUtils.collectionKeys.qualitycontrolsessions;
    }
    constructor(...args){
        super(...args);
        this.name = null;
        this.state = null;
        this.description = null;
        this.tags = [];
        this.type = null;
        this.scheduledDate = null;
        this.samplePreparationStatus = _types.SamplePreparationStatus.NotDone;
        this.modificationStatus = _types.ModificationStatus.NotSet;
        this.params = null;
        this.sheetId = null;
        this.referenceObjectId = null;
        this.referenceObjectIdFull = null;
        this.locationFacilityId = null;
        this.results = [];
        this.resultsFull = [];
        this.analyses = [];
        this.analysesFull = [];
    }
};
_ts_decorate([
    (0, _classtransformer.Transform)(({ value })=>(0, _utils.formatDatesForFS)(value)),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], QualityControlSession.prototype, "scheduledDate", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], QualityControlSession.prototype, "referenceObjectId", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    (0, _ormAnnotations.expandFromId)('referenceObjectId'),
    _ts_metadata("design:type", Object)
], QualityControlSession.prototype, "referenceObjectIdFull", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], QualityControlSession.prototype, "locationFacilityId", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", Array)
], QualityControlSession.prototype, "results", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    (0, _ormAnnotations.expandFromId)('results'),
    _ts_metadata("design:type", Array)
], QualityControlSession.prototype, "resultsFull", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    (0, _ormAnnotations.cascadingDelete)(),
    _ts_metadata("design:type", Array)
], QualityControlSession.prototype, "analyses", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    (0, _ormAnnotations.expandFromId)('analyses'),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], QualityControlSession.prototype, "analysesFull", void 0);
