"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return VarietyPriceV1;
    }
});
const _classtransformer = require("class-transformer");
const _dbMappingUtils = require("../../v1utils/dbMappingUtils");
const _ormAnnotations = require("../../v1utils/ormAnnotations");
const _VarietyV1 = /*#__PURE__*/ _interop_require_default(require("./VarietyV1"));
const _PriceContainer = /*#__PURE__*/ _interop_require_default(require("../utis/PriceContainer"));
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
let VarietyPriceV1 = class VarietyPriceV1 extends _AbstractEntity.AbstractEntity {
    getCollection() {
        return _dbMappingUtils.collectionKeys.varietyprices;
    }
    constructor(...args){
        super(...args);
        this.name = null;
        this.variety = null;
        this.varietyFull = null;
        this.price = null;
        this.parentFacility = null;
    }
};
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], VarietyPriceV1.prototype, "variety", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    (0, _ormAnnotations.expandFromId)('variety'),
    _ts_metadata("design:type", typeof _VarietyV1.default === "undefined" ? Object : _VarietyV1.default)
], VarietyPriceV1.prototype, "varietyFull", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_PriceContainer.default),
    _ts_metadata("design:type", typeof _PriceContainer.default === "undefined" ? Object : _PriceContainer.default)
], VarietyPriceV1.prototype, "price", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], VarietyPriceV1.prototype, "parentFacility", void 0);
