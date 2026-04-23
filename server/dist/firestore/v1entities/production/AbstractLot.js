"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return AbstractLot;
    }
});
const _classtransformer = require("class-transformer");
const _ormAnnotations = require("../../v1utils/ormAnnotations");
const _ObjectId = require("../utis/ObjectId");
const _AbstractEntity = require("../utis/AbstractEntity");
const _types = require("../utis/types");
const _utils = require("../../v1utils/utils");
const _ProcessingProperties = /*#__PURE__*/ _interop_require_default(require("./ProcessingProperties"));
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
// import ActivityCompletion from './ActivityCompletion';
// import LotUsageSection from './LotUsageSection';
let AccumulationRefreshType = class AccumulationRefreshType {
};
let AbstractLot = class AbstractLot extends _AbstractEntity.AbstractEntity {
    // get activityCompletionsContributingToTotal(): Array<ActivityCompletion> {
    //   return (this.activityCompletionsFull || []).filter(
    //     (s) => s.aCType != ACType.NotContributingToTotal,
    //   );
    // }
    // get lastActivityCompletion(): ActivityCompletion {
    //   return this.activityCompletionsInOrder[0];
    // }
    // get activityCompletionsInOrder(): Array<ActivityCompletion> {
    //   const r = (this.activityCompletionsFull || []).sort((a, b) => {
    //     if (a.createdDate > b.createdDate) {
    //       return -1;
    //     } else {
    //       return 1;
    //     }
    //   });
    //   return r;
    // }
    // get activityCompletionsInReverseOrder(): Array<ActivityCompletion> {
    //   const r = (this.activityCompletionsFull || []).sort((a, b) => {
    //     if (a.createdDate > b.createdDate) {
    //       return 1;
    //     } else {
    //       return -1;
    //     }
    //   });
    //   return r;
    // }
    //
    // public deleteActivityCompletion(activityCompletion: ObjectId) {
    //   const index = this.activityCompletions.findIndex(
    //     (a) => a.id === activityCompletion.id,
    //   );
    //   this.activityCompletions.splice(index, 1);
    //   this.activityCompletionsFull.splice(index, 1);
    // }
    // public deleteLotSection(activityCompletion: ObjectId) {
    //   const index = this.lotSections.findIndex(
    //     (a) => a.id === activityCompletion.id,
    //   );
    //   this.lotSections.splice(index, 1);
    //   this.lotSectionsFull.splice(index, 1);
    // }
    //
    // public addActivityCompletion(activityCompletion: ActivityCompletion) {
    //   if (!this.activityCompletions) {
    //     this.activityCompletions = [];
    //   }
    //   if (!this.activityCompletionsFull) {
    //     this.activityCompletionsFull = [];
    //   }
    //   for (const ac of this.activityCompletionsFull) {
    //     ac.hasMovedToNext = true;
    //   }
    //
    //   this.activityCompletions.push(activityCompletion.id);
    //   this.activityCompletionsFull.push(activityCompletion);
    // }
    setWorkFlowId(id) {
        this.id.workflowId = id;
    }
    setChainId(id) {
        this.id.chainId = id;
    }
    constructor(...args){
        super(...args);
        // implements
        // HasProcessingProperties,
        // CanHaveWorkflow,
        // HasActivityCompletions,
        // HasNotes
        this.workFlowName = null;
        this.hasMovedToNext = false;
        this.workflowFinished = false;
        this.lotIdentifier = null;
        this.currentState = null;
        this.lastActivityName = null;
        this.lastActivityType = null;
        this.createdByActivityName = null;
        this.systemState = null;
        this.accumulationRefreshType = null;
        this.samplePreparationStatus = _types.SamplePreparationStatus.NotDone;
        this.transportStatus = _types.TransportStatus.NotSet;
        this.modificationStatus = _types.ModificationStatus.NotSet;
        this.approvalStatusBuyer = _types.LotApprovalStatus.NotSet;
        this.shippingStatus = _types.ShippingStatus.NotSet;
        this.purchaseStatus = _types.PurchaseStatus.NotSet;
        this.samplingStatus = _types.SamplingStatus.NotSet;
        this.evaluationStatus = _types.EvaluationStatus.NotSet;
        this.physicalEvaluationStatus = _types.EvaluationStatus.NotSet;
        this.sensorialEvaluationStatus = _types.EvaluationStatus.NotSet;
        this.phytosanitaryEvaluationStatus = _types.EvaluationStatus.NotSet;
        this.reportStatus = _types.LockStatus.NotSet;
        this.paymentStatus = _types.PaymentStatus.NotSet;
        this.facility = null;
        this.season = null;
        this.processingProperties = new _ProcessingProperties.default();
        this.startDate = null;
        this.endDate = null;
    }
};
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    (0, _ormAnnotations.cascadingDelete)(),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], AbstractLot.prototype, "paymentTransactions", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], AbstractLot.prototype, "facility", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], AbstractLot.prototype, "season", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ProcessingProperties.default),
    _ts_metadata("design:type", typeof _ProcessingProperties.default === "undefined" ? Object : _ProcessingProperties.default)
], AbstractLot.prototype, "processingProperties", void 0);
_ts_decorate([
    (0, _classtransformer.Transform)(({ value })=>(0, _utils.formatDatesForFS)(value)),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], AbstractLot.prototype, "startDate", void 0);
_ts_decorate([
    (0, _classtransformer.Transform)(({ value })=>(0, _utils.formatDatesForFS)(value)),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], AbstractLot.prototype, "endDate", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    (0, _ormAnnotations.cascadingDelete)(),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], AbstractLot.prototype, "activityCompletions", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], AbstractLot.prototype, "lotSections", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_types.StatusHistoryItem),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], AbstractLot.prototype, "statusHistoryItems", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_types.NoteItem),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], AbstractLot.prototype, "noteItems", void 0);
