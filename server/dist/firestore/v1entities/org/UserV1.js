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
    Gender: function() {
        return Gender;
    },
    UserType: function() {
        return UserType;
    },
    default: function() {
        return UserV1;
    }
});
const _classtransformer = require("class-transformer");
const _utils = require("../../v1utils/utils");
const _dbMappingUtils = require("../../v1utils/dbMappingUtils");
const _ormAnnotations = require("../../v1utils/ormAnnotations");
const _UploadDocument = /*#__PURE__*/ _interop_require_default(require("../general/UploadDocument"));
const _ObjectId = require("../utis/ObjectId");
const _AbstractEntity = require("../utis/AbstractEntity");
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
var UserType;
(function(UserType) {
    UserType["Organisation"] = "Organisation";
    UserType["Farmer"] = "Farmer";
    UserType["Picker"] = "Picker";
    UserType["Officer"] = "Officer";
    UserType["FarmEmployee"] = "FarmEmployee";
    UserType["FactoryEmployee"] = "FactoryEmployee";
})(UserType || (UserType = {}));
var Gender;
(function(Gender) {
    Gender["Male"] = "Male";
    Gender["Female"] = "Female";
    Gender["Other"] = "Other";
})(Gender || (Gender = {}));
let UserV1 = class UserV1 extends _AbstractEntity.AbstractEntity {
    getCollection() {
        return _dbMappingUtils.collectionKeys.users;
    }
    constructor(){
        super();
        this.type = null;
        this.email = null;
        this.phone = null;
        this.phone2 = null;
        this.name = null;
        this.firstName = null;
        this.middleName = null;
        this.lastName = null;
        this.nickName = null;
        this.gender = null;
        this.dob = null;
        this.dobApproximate = null;
        this.identificationNumber = null;
        this.identificationNumberType = null;
        this.education = null;
        this.maritalStatus = null;
        this.houseHoldMemberCount = null;
        this.parentFacility = null;
        this.parentFacilityParent = null;
        this.parentFacilityParentParent = null;
        this.parentLocation = null;
        this.parentLocationCode = null;
        this.parentLocationName = null;
        this.parentLocationParent = null;
        this.parentLocationParentCode = null;
        this.parentLocationParentName = null;
        this.parentLocationParentParent = null;
        this.parentLocationParentParentCode = null;
        this.parentLocationParentParentName = null;
        this.parentLocationParentParentParent = null;
        this.parentLocationParentParentParentCode = null;
        this.parentLocationParentParentParentName = null;
    }
};
_ts_decorate([
    (0, _classtransformer.Transform)(({ value })=>(0, _utils.formatDatesForFS)(value)),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], UserV1.prototype, "dob", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], UserV1.prototype, "picture", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    (0, _ormAnnotations.expandFromId)('picture'),
    _ts_metadata("design:type", typeof _UploadDocument.default === "undefined" ? Object : _UploadDocument.default)
], UserV1.prototype, "pictureFull", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], UserV1.prototype, "contactPersonForFacility", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], UserV1.prototype, "parentFacility", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], UserV1.prototype, "parentFacilityParent", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], UserV1.prototype, "parentFacilityParentParent", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], UserV1.prototype, "parentLocation", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], UserV1.prototype, "parentLocationParent", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], UserV1.prototype, "parentLocationParentParent", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], UserV1.prototype, "parentLocationParentParentParent", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    (0, _ormAnnotations.cascadingDelete)(),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], UserV1.prototype, "trainings", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    (0, _ormAnnotations.expandFromId)('trainings'),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], UserV1.prototype, "trainingsFull", void 0);
