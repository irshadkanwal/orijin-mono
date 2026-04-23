"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PaymentTransactionV1", {
    enumerable: true,
    get: function() {
        return PaymentTransactionV1;
    }
});
const _classtransformer = require("class-transformer");
const _dbMappingUtils = require("../../v1utils/dbMappingUtils");
const _ormAnnotations = require("../../v1utils/ormAnnotations");
const _ObjectId = require("../utis/ObjectId");
const _AbstractEntity = require("../utis/AbstractEntity");
const _utils = require("../../v1utils/utils");
const _types = require("../utis/types");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let PaymentTransactionV1 = class PaymentTransactionV1 extends _AbstractEntity.AbstractEntity {
    getCollection() {
        return _dbMappingUtils.collectionKeys.paymenttransactions;
    }
    constructor(...args){
        super(...args);
        this.type = _types.PaymentType.NotSet;
        this.externalId = null;
        this.status = _types.PaymentStatus.NotSet;
        this.localAccountId = null;
        this.localFirstName = null;
        this.localLastName = null;
        this.targetAccountId = null;
        this.targetFirstName = null;
        this.targetLastName = null;
        this.amount = null;
        this.currency = null;
        this.paymentType = null;
        this.productQuantity = null;
        this.errorMsg = null;
        this.errorStatus = null;
        this.resolutionComment = null;
        this.externalAccount = null;
        this.externalPaymentType = null;
        this.externalState = null;
        this.feeCharged = null;
        this.remote_transaction_id = null;
        this.retryCounter = 0;
        this.productionEntity = null;
        this.productionEntityParent = null;
        this.producerEntity = null;
        this.producerName = null;
        this.targetWallet = null;
        this.producerEntityFull = null;
    }
};
_ts_decorate([
    (0, _classtransformer.Transform)(({ value })=>(0, _utils.formatDatesForFS)(value)),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], PaymentTransactionV1.prototype, "transactionCreatedDate", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_types.ObjectIdUser),
    _ts_metadata("design:type", typeof _types.ObjectIdUser === "undefined" ? Object : _types.ObjectIdUser)
], PaymentTransactionV1.prototype, "transactionCreatedBy", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], PaymentTransactionV1.prototype, "productionEntity", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], PaymentTransactionV1.prototype, "productionEntityParent", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], PaymentTransactionV1.prototype, "producerEntity", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], PaymentTransactionV1.prototype, "targetWallet", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    (0, _ormAnnotations.expandFromId)('producerEntity'),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], PaymentTransactionV1.prototype, "producerEntityFull", void 0);
