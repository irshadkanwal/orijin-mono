"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WalletV1", {
    enumerable: true,
    get: function() {
        return WalletV1;
    }
});
const _classtransformer = require("class-transformer");
const _dbMappingUtils = require("../../v1utils/dbMappingUtils");
const _ormAnnotations = require("../../v1utils/ormAnnotations");
const _ObjectId = require("../utis/ObjectId");
const _AbstractEntity = require("../utis/AbstractEntity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let WalletV1 = class WalletV1 extends _AbstractEntity.AbstractEntity {
    getCollection() {
        return _dbMappingUtils.collectionKeys.wallets;
    }
    constructor(...args){
        super(...args);
        this.type = null;
        this.externalId = null;
        this.status = null;
        this.firstName = null;
        this.lastName = null;
        this.phone = null;
        this.errorMsg = null;
        this.errorStatus = null;
        this.resolutionComment = null;
        this.name_on_network = null;
        this.name_matches_network_score = null;
        this.name_matches_network_status = null;
        this.identityProducer = null;
        this.usingFarmsFullIds = [];
    }
};
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], WalletV1.prototype, "identityProducer", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], WalletV1.prototype, "usingFarms", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    (0, _ormAnnotations.expandFromId)('usingFarms'),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], WalletV1.prototype, "usingFarmsFull", void 0);
