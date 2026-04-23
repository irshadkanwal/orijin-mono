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
    ACType: function() {
        return ACType;
    },
    AccumulationType: function() {
        return AccumulationType;
    },
    AccumulationWeightKey: function() {
        return AccumulationWeightKey;
    },
    ApprovalItem: function() {
        return ApprovalItem;
    },
    AuthCredential: function() {
        return AuthCredential;
    },
    CreationStatus: function() {
        return CreationStatus;
    },
    EvaluationStatus: function() {
        return EvaluationStatus;
    },
    ExternalSystemAccount: function() {
        return ExternalSystemAccount;
    },
    FarmSystemStatus: function() {
        return FarmSystemStatus;
    },
    FormSubmissionType: function() {
        return FormSubmissionType;
    },
    GoogleApiCredential: function() {
        return GoogleApiCredential;
    },
    InspectionApprovalStatus: function() {
        return InspectionApprovalStatus;
    },
    LocationsFilter: function() {
        return LocationsFilter;
    },
    LockStatus: function() {
        return LockStatus;
    },
    LotApprovalStatus: function() {
        return LotApprovalStatus;
    },
    LotState: function() {
        return LotState;
    },
    MFSRegistration: function() {
        return MFSRegistration;
    },
    ModificationStatus: function() {
        return ModificationStatus;
    },
    NoteItem: function() {
        return NoteItem;
    },
    ObjectIdUser: function() {
        return ObjectIdUser;
    },
    OriginType: function() {
        return OriginType;
    },
    PaymentStatus: function() {
        return PaymentStatus;
    },
    PaymentSummary: function() {
        return PaymentSummary;
    },
    PaymentType: function() {
        return PaymentType;
    },
    ProdLotType: function() {
        return ProdLotType;
    },
    PurchaseStatus: function() {
        return PurchaseStatus;
    },
    RegistrationStatus: function() {
        return RegistrationStatus;
    },
    ReviewStatus: function() {
        return ReviewStatus;
    },
    SamplePreparationStatus: function() {
        return SamplePreparationStatus;
    },
    SamplingStatus: function() {
        return SamplingStatus;
    },
    SeasonHistoryItem: function() {
        return SeasonHistoryItem;
    },
    ShippingStatus: function() {
        return ShippingStatus;
    },
    StatusHistoryItem: function() {
        return StatusHistoryItem;
    },
    TransportStatus: function() {
        return TransportStatus;
    }
});
const _dbMappingUtils = require("../../v1utils/dbMappingUtils");
const _ObjectId = require("./ObjectId");
const _paginationAndSortingdto = require("../../../common/dto/paginationAndSorting.dto");
const _classtransformer = require("class-transformer");
const _utils = require("../../v1utils/utils");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
var ACType;
(function(ACType) {
    ACType["Multi"] = "Multi";
    ACType["NotContributingToTotal"] = "NotContributingToTotal";
    ACType["DontCreate"] = "DontCreate";
    ACType["Standard"] = "Standard";
    ACType["Single"] = "Single";
})(ACType || (ACType = {}));
let MFSRegistration = class MFSRegistration {
    constructor(){
        this.externalId = null;
        this.phone = null;
        this.firstName = null;
        this.lastName = null;
    }
};
let ExternalSystemAccount = class ExternalSystemAccount {
    constructor(){
        this.systemName = null;
        this.type = null;
        this.externalId = null;
        this.phone = null;
        this.firstName = null;
        this.lastName = null;
        this.info = null;
        this.infoPhoneNumberOwner = null;
    }
};
let PaymentSummary = class PaymentSummary {
    constructor(){
        this.targetAccountId = null;
        this.targetFirstName = null;
        this.targetLastName = null;
        this.amount = null;
        this.currency = null;
        this.paymentStatus = null;
        this.externalStatus = null;
        this.errorMsg = null;
        this.productionEntity = null;
        this.productionEntityParent = null;
        this.producerEntity = null;
    }
};
let SeasonHistoryItem = class SeasonHistoryItem {
};
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], SeasonHistoryItem.prototype, "season", void 0);
let ApprovalItem = class ApprovalItem {
};
_ts_decorate([
    (0, _classtransformer.Transform)(({ value })=>(0, _utils.formatDatesForFS)(value)),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], ApprovalItem.prototype, "date", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], ApprovalItem.prototype, "user", void 0);
var AccumulationType;
(function(AccumulationType) {
    AccumulationType["None"] = "None";
    AccumulationType["ProdLot"] = "ProdLot";
    AccumulationType["AE"] = "AE";
    AccumulationType["LotSection"] = "LotSection";
    AccumulationType["LotSectionSource"] = "LotSectionSource";
    AccumulationType["Batch"] = "Batch";
})(AccumulationType || (AccumulationType = {}));
var AccumulationWeightKey;
(function(AccumulationWeightKey) {
    AccumulationWeightKey["beforeWeight"] = "beforeWeight";
    AccumulationWeightKey["afterWeight"] = "afterWeight";
})(AccumulationWeightKey || (AccumulationWeightKey = {}));
var ProdLotType;
(function(ProdLotType) {
    ProdLotType["Group"] = "Group";
    ProdLotType["Sample"] = "Sample";
    ProdLotType["Single"] = "Single";
})(ProdLotType || (ProdLotType = {}));
var OriginType;
(function(OriginType) {
    OriginType["Tree"] = "Tree";
    OriginType["Plot"] = "Plot";
    OriginType["Variety"] = "Variety";
    OriginType["Location"] = "Location";
    OriginType["LocationParent"] = "LocationParent";
    OriginType["Product"] = "Product";
    OriginType["DayColour"] = "DayColour";
    OriginType["Facility"] = "Facility";
    OriginType["Season"] = "Season";
    OriginType["Operator"] = "Operator";
    OriginType["Farm"] = "Farm";
})(OriginType || (OriginType = {}));
let StatusHistoryItem = class StatusHistoryItem {
};
_ts_decorate([
    (0, _classtransformer.Transform)(({ value })=>(0, _utils.formatDatesForFS)(value)),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], StatusHistoryItem.prototype, "date", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], StatusHistoryItem.prototype, "user", void 0);
let NoteItem = class NoteItem {
};
_ts_decorate([
    (0, _classtransformer.Transform)(({ value })=>(0, _utils.formatDatesForFS)(value)),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], NoteItem.prototype, "date", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], NoteItem.prototype, "user", void 0);
var PaymentType;
(function(PaymentType) {
    PaymentType["NotSet"] = "NotSet";
    PaymentType["MobilePay"] = "MobilePay";
    PaymentType["Cash"] = "Cash";
    PaymentType["Credit"] = "Credit";
    PaymentType["Cheque"] = "Cheque";
})(PaymentType || (PaymentType = {}));
var LotState;
(function(LotState) {
    LotState["Open"] = "Open";
    LotState["Public"] = "Public";
    LotState["Origin"] = "Origin";
    LotState["Private"] = "Private";
    LotState["EndProduct"] = "EndProduct";
    LotState["Archived"] = "Archived";
    LotState["Closed"] = "Closed";
})(LotState || (LotState = {}));
var TransportStatus;
(function(TransportStatus) {
    TransportStatus["NotSet"] = "NotSet";
    TransportStatus["InTransport"] = "InTransport";
    TransportStatus["NotReady"] = "NotReady";
    TransportStatus["Ready"] = "Ready";
    TransportStatus["Received"] = "Received";
})(TransportStatus || (TransportStatus = {}));
var ModificationStatus;
(function(ModificationStatus) {
    ModificationStatus["NotSet"] = "NotSet";
    ModificationStatus["CanModify"] = "CanModify";
    ModificationStatus["CanModifyNonEssentials"] = "CanModifyNonEssentials";
    ModificationStatus["Closed"] = "Closed";
})(ModificationStatus || (ModificationStatus = {}));
var SamplePreparationStatus;
(function(SamplePreparationStatus) {
    SamplePreparationStatus["Done"] = "Done";
    SamplePreparationStatus["NotDone"] = "NotDone";
})(SamplePreparationStatus || (SamplePreparationStatus = {}));
var InspectionApprovalStatus;
(function(InspectionApprovalStatus) {
    InspectionApprovalStatus["NotSet"] = "NotSet";
    InspectionApprovalStatus["Approved"] = "Approved";
    InspectionApprovalStatus["ApprovedWithConditions"] = "ApprovedWithConditions";
    InspectionApprovalStatus["Rejected"] = "Rejected";
})(InspectionApprovalStatus || (InspectionApprovalStatus = {}));
var CreationStatus;
(function(CreationStatus) {
    CreationStatus["NotSet"] = "NotSet";
    CreationStatus["DataImport"] = "DataImport";
    CreationStatus["ByUser"] = "ByUser";
    CreationStatus["InBuying"] = "InBuying";
})(CreationStatus || (CreationStatus = {}));
var FormSubmissionType;
(function(FormSubmissionType) {
    FormSubmissionType["NotSet"] = "NotSet";
    FormSubmissionType["StandardSubmission"] = "StandardSubmission";
    FormSubmissionType["DeferredSubmission"] = "DeferredSubmission";
    FormSubmissionType["DeferredTotalsCalculations"] = "DeferredTotalsCalculations";
})(FormSubmissionType || (FormSubmissionType = {}));
var ReviewStatus;
(function(ReviewStatus) {
    ReviewStatus["NotSet"] = "NotSet";
    ReviewStatus["NeedsReview"] = "NeedsReview";
    ReviewStatus["InReview"] = "InReview";
    ReviewStatus["Rejected"] = "Rejected";
    ReviewStatus["Approved"] = "Approved";
    ReviewStatus["TentativelyApproved"] = "TentativelyApproved";
    ReviewStatus["ApprovedWithConditions"] = "ApprovedWithConditions";
})(ReviewStatus || (ReviewStatus = {}));
var FarmSystemStatus;
(function(FarmSystemStatus) {
    FarmSystemStatus["NotSet"] = "NotSet";
    FarmSystemStatus["Active"] = "Active";
    FarmSystemStatus["InActive"] = "InActive";
    FarmSystemStatus["Suspended"] = "Suspended";
})(FarmSystemStatus || (FarmSystemStatus = {}));
var LotApprovalStatus;
(function(LotApprovalStatus) {
    LotApprovalStatus["NotSet"] = "NotSet";
    LotApprovalStatus["Approved"] = "Approved";
    LotApprovalStatus["Rejected"] = "Rejected";
    LotApprovalStatus["Discarded"] = "Discarded";
    LotApprovalStatus["TentativelyApproved"] = "TentativelyApproved";
})(LotApprovalStatus || (LotApprovalStatus = {}));
var PaymentStatus;
(function(PaymentStatus) {
    PaymentStatus["NotSet"] = "NotSet";
    PaymentStatus["Created"] = "Created";
    PaymentStatus["InProgress"] = "InProgress";
    PaymentStatus["Draft"] = "Draft";
    PaymentStatus["ActionRequired"] = "ActionRequired";
    PaymentStatus["Scheduled"] = "Scheduled";
    PaymentStatus["Completed"] = "Completed";
    PaymentStatus["CompletedWithError"] = "CompletedWithError";
    PaymentStatus["Error"] = "Error";
})(PaymentStatus || (PaymentStatus = {}));
var RegistrationStatus;
(function(RegistrationStatus) {
    RegistrationStatus["NotSet"] = "NotSet";
    RegistrationStatus["InProgress"] = "InProgress";
    RegistrationStatus["Draft"] = "Draft";
    RegistrationStatus["Completed"] = "Completed";
    RegistrationStatus["ActionRequired"] = "ActionRequired";
    RegistrationStatus["NameMismatch"] = "NameMismatch";
    RegistrationStatus["CompletedWithError"] = "CompletedWithError";
    RegistrationStatus["Error"] = "Error";
})(RegistrationStatus || (RegistrationStatus = {}));
var LockStatus;
(function(LockStatus) {
    LockStatus["NotSet"] = "NotSet";
    LockStatus["Locked"] = "Locked";
    LockStatus["Unlocked"] = "Unlocked";
})(LockStatus || (LockStatus = {}));
var ShippingStatus;
(function(ShippingStatus) {
    ShippingStatus["NotSet"] = "NotSet";
    ShippingStatus["Shipped"] = "Shipped";
    ShippingStatus["NotShipped"] = "NotShipped";
})(ShippingStatus || (ShippingStatus = {}));
var SamplingStatus;
(function(SamplingStatus) {
    SamplingStatus["NotSet"] = "NotSet";
    SamplingStatus["Sampled"] = "Sampled";
    SamplingStatus["InSampling"] = "InSampling";
    SamplingStatus["NotSampled"] = "NotSampled";
})(SamplingStatus || (SamplingStatus = {}));
var PurchaseStatus;
(function(PurchaseStatus) {
    PurchaseStatus["NotSet"] = "NotSet";
    PurchaseStatus["Purchased"] = "Purchased";
    PurchaseStatus["NotPurchased"] = "NotPurchased";
})(PurchaseStatus || (PurchaseStatus = {}));
var EvaluationStatus;
(function(EvaluationStatus) {
    EvaluationStatus["NotSet"] = "NotSet";
    EvaluationStatus["Started"] = "Started";
    EvaluationStatus["InProgress"] = "InProgress";
    EvaluationStatus["Evaluated"] = "Evaluated";
    EvaluationStatus["NotEvaluated"] = "NotEvaluated";
})(EvaluationStatus || (EvaluationStatus = {}));
let ObjectIdUser = class ObjectIdUser extends _ObjectId.ObjectId {
    constructor(id, email){
        super(id, _dbMappingUtils.collectionKeys.platformusers);
        this.email = email;
    }
};
let AuthCredential = class AuthCredential {
};
let GoogleApiCredential = class GoogleApiCredential {
    constructor(accessToken, refreshToken, expiryDate, idToken, scope){
        this.accessToken = null;
        this.refreshToken = null;
        this.scope = null;
        this.expiryDate = null;
        this.idToken = null;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.scope = scope;
        this.expiryDate = expiryDate;
        this.idToken = idToken;
    }
};
let LocationsFilter = class LocationsFilter extends _paginationAndSortingdto.PaginationAndSortingDto {
};
