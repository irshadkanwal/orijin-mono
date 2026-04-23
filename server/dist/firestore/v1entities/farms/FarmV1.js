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
    CertificationStatus: function() {
        return CertificationStatus;
    },
    default: function() {
        return FarmV1;
    }
});
const _classtransformer = require("class-transformer");
const _dbMappingUtils = require("../../v1utils/dbMappingUtils");
const _ObjectId = require("../utis/ObjectId");
const _FacilityV1 = /*#__PURE__*/ _interop_require_default(require("../refdata/FacilityV1"));
const _ormAnnotations = require("../../v1utils/ormAnnotations");
const _types = require("../utis/types");
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
var CertificationStatus;
(function(CertificationStatus) {
    CertificationStatus["Multi"] = "Certified";
    CertificationStatus["New"] = "New";
    CertificationStatus["NotCertified"] = "NotCertified";
    CertificationStatus["InTransition"] = "InTransition";
    CertificationStatus["NotSet"] = "NotSet";
    CertificationStatus["NeverCertified"] = "NeverCertified";
    CertificationStatus["Expelled"] = "Expelled";
    CertificationStatus["Suspended"] = "Suspended";
    CertificationStatus["Sanctioned"] = "Sanctioned";
})(CertificationStatus || (CertificationStatus = {}));
let FarmV1 = class FarmV1 extends _FacilityV1.default {
    getCollection() {
        return _dbMappingUtils.collectionKeys.farms;
    }
    constructor(...args){
        super(...args);
        this.name = null;
        this.nickName = null;
        this.certificationStatus = "NotSet";
        this.isOrganic = null;
        this.parentFacility = null;
        this.parentFacilityParent = null;
        this.parentFacilityParentParent = null;
        this.parentLocation = null;
        this.parentLocationParent = null;
        this.parentLocationParentParent = null;
        this.parentLocationParentParentParent = null;
        this.mobilePayWalletsFullIds = [];
        this.mobilePayRegistrationStatus = _types.RegistrationStatus.NotSet;
    }
};
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], FarmV1.prototype, "parentFacility", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], FarmV1.prototype, "parentFacilityParent", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], FarmV1.prototype, "parentFacilityParentParent", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], FarmV1.prototype, "parentLocation", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], FarmV1.prototype, "parentLocationParent", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], FarmV1.prototype, "parentLocationParentParent", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], FarmV1.prototype, "parentLocationParentParentParent", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], FarmV1.prototype, "mobilePayWallets", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    (0, _ormAnnotations.expandFromId)('mobilePayWallets'),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], FarmV1.prototype, "mobilePayWalletsFull", void 0);
