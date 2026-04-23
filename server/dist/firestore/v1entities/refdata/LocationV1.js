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
    LocationType: function() {
        return LocationType;
    },
    default: function() {
        return LocationV1;
    }
});
const _classtransformer = require("class-transformer");
const _dbMappingUtils = require("../../v1utils/dbMappingUtils");
const _Coordinates = /*#__PURE__*/ _interop_require_default(require("../utis/Coordinates"));
const _ormAnnotations = require("../../v1utils/ormAnnotations");
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
var LocationType;
(function(LocationType) {
    LocationType["Country"] = "Country";
    LocationType["Region"] = "Region";
    LocationType["Parish"] = "Parish";
    LocationType["Zone"] = "Zone";
    LocationType["Village"] = "Village";
    LocationType["Municipality"] = "Municipality";
    LocationType["District"] = "District";
})(LocationType || (LocationType = {}));
let LocationV1 = class LocationV1 extends _AbstractEntity.AbstractEntity {
    getCollection() {
        return _dbMappingUtils.collectionKeys.locations;
    }
    constructor(...args){
        super(...args);
        this.name = null;
        this.coordinates = null;
        this.type = null;
        this.parentFacility = null;
        this.parentFacilityParent = null;
        this.parentFacilityParentParent = null;
        this.parentLocation = null;
        this.parentLocationParent = null;
        this.parentLocationParentParent = null;
        this.parentLocationFull = null;
    }
};
_ts_decorate([
    (0, _classtransformer.Type)(()=>_Coordinates.default),
    _ts_metadata("design:type", typeof _Coordinates.default === "undefined" ? Object : _Coordinates.default)
], LocationV1.prototype, "coordinates", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], LocationV1.prototype, "parentFacility", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], LocationV1.prototype, "parentFacilityParent", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], LocationV1.prototype, "parentFacilityParentParent", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], LocationV1.prototype, "parentLocation", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], LocationV1.prototype, "parentLocationParent", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], LocationV1.prototype, "parentLocationParentParent", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    (0, _ormAnnotations.expandFromId)('parentLocation'),
    _ts_metadata("design:type", Object)
], LocationV1.prototype, "parentLocationFull", void 0);
