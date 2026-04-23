"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return Farm_minV1;
    }
});
const _classtransformer = require("class-transformer");
const _dbMappingUtils = require("../../v1utils/dbMappingUtils");
const _ObjectId = require("../utis/ObjectId");
const _FacilityV1 = /*#__PURE__*/ _interop_require_default(require("../refdata/FacilityV1"));
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
let Farm_minV1 = class Farm_minV1 extends _FacilityV1.default {
    // @Type(() => ObjectId)
    // mobilePayWallets: Array<ObjectId>;
    //
    // @Exclude()
    // @expandFromId('mobilePayWallets')
    // mobilePayWalletsFull: Array<Wallet>;
    //
    // mobilePayWalletsFullIds: Array<string> = [];
    // mobilePayRegistrationStatus: RegistrationStatus = RegistrationStatus.NotSet;
    getCollection() {
        return _dbMappingUtils.collectionKeys.farms_min;
    }
    constructor(...args){
        super(...args);
        this.name = null;
        this.nickName = null;
        this.parentFacility = null;
        this.parentFacilityParent = null;
        this.parentFacilityParentParent = null;
        this.parentLocation = null;
        this.parentLocationParent = null;
        this.parentLocationParentParent = null;
        this.parentLocationParentParentParent = null;
    }
};
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], Farm_minV1.prototype, "parentFacility", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], Farm_minV1.prototype, "parentFacilityParent", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], Farm_minV1.prototype, "parentFacilityParentParent", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], Farm_minV1.prototype, "parentLocation", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], Farm_minV1.prototype, "parentLocationParent", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], Farm_minV1.prototype, "parentLocationParentParent", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], Farm_minV1.prototype, "parentLocationParentParentParent", void 0);
