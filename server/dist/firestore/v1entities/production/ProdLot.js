"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return ProdLot;
    }
});
const _classtransformer = require("class-transformer");
const _dbMappingUtils = require("../../v1utils/dbMappingUtils");
const _ormAnnotations = require("../../v1utils/ormAnnotations");
const _ObjectId = require("../utis/ObjectId");
const _AbstractLot = /*#__PURE__*/ _interop_require_default(require("./AbstractLot"));
const _SourceRelationshipWeightArrayObject = /*#__PURE__*/ _interop_require_default(require("../utis/SourceRelationshipWeightArrayObject"));
const _OriginProperties = /*#__PURE__*/ _interop_require_default(require("./OriginProperties"));
const _types = require("../utis/types");
const _Coordinates = /*#__PURE__*/ _interop_require_default(require("../utis/Coordinates"));
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
let ProdLot = class ProdLot extends _AbstractLot.default {
    deleteQualityControlResults(activityCompletion) {
        const index = this.qualityControlResults.findIndex((a)=>a.id === activityCompletion.id);
        this.qualityControlResults.splice(index, 1);
        this.qualityControlResultsFull.splice(index, 1);
    }
    // @Type(() => PaymentSummary)
    // payments: Array<PaymentSummary> = <Array<PaymentSummary>>[];
    // constructor(prodlotType: OriginType[]) {
    //   super();
    //   this.originType = prodlotType;
    // }
    // public addSourceWithContainer(id: ObjectId, containerId: Array<number>) {
    //   if (!containerId) {
    //     throw Error('container ids have to be defined');
    //   } else {
    //     const weight = new SourceRelationshipWeight();
    //     weight.containerId = containerId;
    //     this.sources.push(new SourceRelationshipWeightArrayObject(id, weight));
    //   }
    // }
    // public addSource(id: ObjectId, weightToAdd?: SourceRelationshipWeight) {
    //   if (!weightToAdd) {
    //     weightToAdd = new SourceRelationshipWeight();
    //     weightToAdd.percentage = 100;
    //   }
    //
    //   // console.log("HHEHRRE");
    //
    //   let exists = false;
    //   for (const s of this.sources || []) {
    //     if (s.weight.percentage == 100 && s.ref.id == id.id) {
    //       exists = true;
    //     }
    //   }
    //
    //   if (!exists) {
    //     if (!this.sources) {
    //       this.sources = [];
    //     }
    //     this.sources.push(
    //       new SourceRelationshipWeightArrayObject(id, weightToAdd),
    //     );
    //   }
    // }
    // removeBatch(toRemove: ObjectId) {
    //   const batchToRemove = this.batches.find((b) => {
    //     return b.id == toRemove.id;
    //   });
    //
    //   const batchToRemoveFull = this.batchesFull.find((b) => {
    //     return b.id.id == toRemove.id;
    //   });
    //
    //   if (!batchToRemove) {
    //     throw Error(
    //       `Batch not found in the parent prodlot ${JSON.stringify(toRemove)}`,
    //     );
    //   }
    //   if (!batchToRemoveFull) {
    //     throw Error(
    //       `Batch not found in the parent prodlot - full ${JSON.stringify(
    //         toRemove,
    //       )}`,
    //     );
    //   }
    //
    //   this.batches.splice(this.batches.indexOf(batchToRemove), 1);
    //   this.batchesFull.splice(this.batchesFull.indexOf(batchToRemoveFull), 1);
    // }
    deleteAnalysis(itemId) {
        const index = this.analyses.findIndex((a)=>a.id === itemId.id);
        this.analyses.splice(index, 1);
        const indexFull = this.analysesFull.findIndex((a)=>a.id.id === itemId.id);
        this.analysesFull.splice(indexFull, 1);
    }
    //
    // addBatch(batch: Batch) {
    //   if (!this.batches) {
    //     this.batches = [];
    //   }
    //   this.batches.push(batch.id);
    //
    //   if (!this.batchesFull) {
    //     this.batchesFull = [];
    //   }
    //   this.batchesFull.push(batch);
    // }
    getCollection() {
        return _dbMappingUtils.collectionKeys.prodlots;
    }
    get location() {
        return this.updatedLocation;
    }
    validateObjectIntegrity() {
    // if (location) {
    //   if (!(location instanceof Location)) {
    //     throw Error("location has to be locationType");
    //   }
    // }
    // if (facility) {
    //   if (!(isObjectIdOfType(facility, "facilities"))) {
    //     throw Error("facilities has to be facilities");
    //   }
    // }
    }
    constructor(...args){
        super(...args);
        this.origin = false;
        this.endProduct = false;
        this.hasBeenSampled = false;
        this.originType = null;
        this.prodlotType = null;
        this.accumulationType = null;
        this.accumulationWeightKey = null;
        this.currentVesselId = null;
        this.previousVesselId = null;
        this.tag = null;
        this.tags = [];
        this.tagsIdLabels = [];
        this.tagStrings = [];
        this.qualityScore = null;
    }
};
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], ProdLot.prototype, "currentVesselId", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], ProdLot.prototype, "previousVesselId", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    (0, _ormAnnotations.mapToObjectId)(_dbMappingUtils.collectionKeys.batches),
    (0, _classtransformer.Type)(()=>_SourceRelationshipWeightArrayObject.default),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], ProdLot.prototype, "sources", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], ProdLot.prototype, "singleSourceRef", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], ProdLot.prototype, "samples", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    (0, _ormAnnotations.expandFromId)('samples'),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], ProdLot.prototype, "samplesFull", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], ProdLot.prototype, "followingProdlotIds", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], ProdLot.prototype, "originPropertiesId", void 0);
_ts_decorate([
    (0, _ormAnnotations.expandFromId)('originPropertiesId'),
    (0, _classtransformer.Exclude)(),
    _ts_metadata("design:type", typeof _OriginProperties.default === "undefined" ? Object : _OriginProperties.default)
], ProdLot.prototype, "originProperties", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], ProdLot.prototype, "tag", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", Array)
], ProdLot.prototype, "tags", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    (0, _ormAnnotations.cascadingDelete)(),
    _ts_metadata("design:type", Array)
], ProdLot.prototype, "analyses", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    (0, _ormAnnotations.expandFromId)('analyses'),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], ProdLot.prototype, "analysesFull", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    (0, _ormAnnotations.cascadingDelete)(),
    _ts_metadata("design:type", Array)
], ProdLot.prototype, "qualityControlResults", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    (0, _ormAnnotations.expandFromId)('qualityControlResults'),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], ProdLot.prototype, "qualityControlResultsFull", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    (0, _ormAnnotations.cascadingDelete)(),
    _ts_metadata("design:type", Array)
], ProdLot.prototype, "qualityControlSessions", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    (0, _ormAnnotations.expandFromId)('qualityControlSessions'),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], ProdLot.prototype, "qualityControlSessionsFull", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_types.ApprovalItem),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], ProdLot.prototype, "approvalItems", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_types.SeasonHistoryItem),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], ProdLot.prototype, "seasonHistory", void 0);
_ts_decorate([
    (0, _classtransformer.Expose)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", typeof _Coordinates.default === "undefined" ? Object : _Coordinates.default)
], ProdLot.prototype, "location", null);
