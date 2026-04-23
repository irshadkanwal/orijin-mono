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
    FacilityType: function() {
        return FacilityType;
    },
    default: function() {
        return FacilityV1;
    }
});
const _classtransformer = require("class-transformer");
const _dbMappingUtils = require("../../v1utils/dbMappingUtils");
const _Coordinates = /*#__PURE__*/ _interop_require_default(require("../utis/Coordinates"));
const _ormAnnotations = require("../../v1utils/ormAnnotations");
const _Address = /*#__PURE__*/ _interop_require_default(require("./Address"));
const _GeoDataV1 = /*#__PURE__*/ _interop_require_default(require("./GeoDataV1"));
const _LocationV1 = /*#__PURE__*/ _interop_require_default(require("./LocationV1"));
const _UserV1 = /*#__PURE__*/ _interop_require_default(require("../org/UserV1"));
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
var FacilityType;
(function(FacilityType) {
    FacilityType["Farm"] = "Farm";
    FacilityType["ProductionFacility"] = "ProductionFacility";
    FacilityType["RoastingFacility"] = "RoastingFacility";
    FacilityType["CollectionFacility"] = "CollectionFacility";
    FacilityType["ProcessingFacility"] = "ProcessingFacility";
    FacilityType["FermentationFacility"] = "FermentationFacility";
    FacilityType["Organisation"] = "Organisation";
    FacilityType["FarmerGroup"] = "FarmerGroup";
    FacilityType["Community"] = "Community";
})(FacilityType || (FacilityType = {}));
let FacilityV1 = class FacilityV1 extends _AbstractEntity.AbstractEntity {
    getCollection() {
        return _dbMappingUtils.collectionKeys.facilities;
    }
    constructor(...args){
        super(...args);
        this.name = null;
        this.type = null;
        this.parentFacility = null;
        this.parentFacilityParent = null;
        this.parentFacilityParentParent = null;
        this.parentFacilityFull = null;
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
        this.parentLocationFull = null;
        this.mainContactPersonFull = null;
        this.location = null;
        this.address = null;
        this.polygon = null;
        this.polygonFull = null;
    }
};
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], FacilityV1.prototype, "parentFacility", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], FacilityV1.prototype, "parentFacilityParent", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], FacilityV1.prototype, "parentFacilityParentParent", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    (0, _ormAnnotations.expandFromId)('parentFacility'),
    _ts_metadata("design:type", Object)
], FacilityV1.prototype, "parentFacilityFull", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], FacilityV1.prototype, "parentLocation", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], FacilityV1.prototype, "parentLocationParent", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], FacilityV1.prototype, "parentLocationParentParent", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], FacilityV1.prototype, "parentLocationParentParentParent", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    (0, _ormAnnotations.expandFromId)('parentLocation'),
    _ts_metadata("design:type", typeof _LocationV1.default === "undefined" ? Object : _LocationV1.default)
], FacilityV1.prototype, "parentLocationFull", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], FacilityV1.prototype, "persons", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], FacilityV1.prototype, "mainContactPerson", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    (0, _ormAnnotations.expandFromId)('mainContactPerson'),
    _ts_metadata("design:type", typeof _UserV1.default === "undefined" ? Object : _UserV1.default)
], FacilityV1.prototype, "mainContactPersonFull", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_Coordinates.default),
    _ts_metadata("design:type", typeof _Coordinates.default === "undefined" ? Object : _Coordinates.default)
], FacilityV1.prototype, "location", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_Address.default),
    _ts_metadata("design:type", typeof _Address.default === "undefined" ? Object : _Address.default)
], FacilityV1.prototype, "address", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], FacilityV1.prototype, "geodatas", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    (0, _ormAnnotations.expandFromId)('geodatas'),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], FacilityV1.prototype, "geodatasFull", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], FacilityV1.prototype, "polygon", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    (0, _ormAnnotations.expandFromId)('polygon'),
    _ts_metadata("design:type", typeof _GeoDataV1.default === "undefined" ? Object : _GeoDataV1.default)
], FacilityV1.prototype, "polygonFull", void 0);
