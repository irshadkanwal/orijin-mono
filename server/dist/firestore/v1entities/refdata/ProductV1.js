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
    ProductType: function() {
        return ProductType;
    },
    default: function() {
        return ProductV1;
    }
});
const _classtransformer = require("class-transformer");
const _dbMappingUtils = require("../../v1utils/dbMappingUtils");
const _PriceContainer = /*#__PURE__*/ _interop_require_default(require("../utis/PriceContainer"));
const _VarietyPriceV1 = /*#__PURE__*/ _interop_require_default(require("./VarietyPriceV1"));
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
var ProductType;
(function(ProductType) {
    ProductType["Cacao"] = "Cacao";
    ProductType["Coffee"] = "Coffee";
})(ProductType || (ProductType = {}));
let ProductV1 = class ProductV1 extends _AbstractEntity.AbstractEntity {
    getCollection() {
        return _dbMappingUtils.collectionKeys.products;
    }
    constructor(...args){
        super(...args);
        this.name = null;
        this.sku = null;
        this.organic = false;
        this.dry = false;
        this.singleOrigin = false;
        this.originFacility = null;
        this.originLocation = null;
        this.originProducer = null;
        this.crop = null;
        this.variety = null;
        this.varietyPrice = null;
        this.price = null;
        this.varietyPriceFull = null;
        this.defaultPackagingContainer = null;
        this.packagingContainers = [];
        this.type = null;
    }
};
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], ProductV1.prototype, "originFacility", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], ProductV1.prototype, "originLocation", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], ProductV1.prototype, "originProducer", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], ProductV1.prototype, "crop", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], ProductV1.prototype, "variety", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], ProductV1.prototype, "varietyPrice", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_PriceContainer.default),
    _ts_metadata("design:type", typeof _PriceContainer.default === "undefined" ? Object : _PriceContainer.default)
], ProductV1.prototype, "price", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    (0, _ormAnnotations.expandFromId)('varietyPrice'),
    _ts_metadata("design:type", typeof _VarietyPriceV1.default === "undefined" ? Object : _VarietyPriceV1.default)
], ProductV1.prototype, "varietyPriceFull", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], ProductV1.prototype, "defaultPackagingContainer", void 0);
