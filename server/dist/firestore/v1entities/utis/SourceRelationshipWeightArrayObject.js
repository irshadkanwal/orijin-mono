"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return SourceRelationshipWeightArrayObject;
    }
});
const _classtransformer = require("class-transformer");
const _SourceRelationshipWeight = /*#__PURE__*/ _interop_require_default(require("./SourceRelationshipWeight"));
const _ObjectId = require("./ObjectId");
const _ProdLot = /*#__PURE__*/ _interop_require_default(require("../production/ProdLot"));
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
let SourceRelationshipWeightArrayObject = class SourceRelationshipWeightArrayObject {
};
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], SourceRelationshipWeightArrayObject.prototype, "ref", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    _ts_metadata("design:type", typeof _ProdLot.default === "undefined" ? Object : _ProdLot.default)
], SourceRelationshipWeightArrayObject.prototype, "refFull", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_SourceRelationshipWeight.default),
    _ts_metadata("design:type", typeof _SourceRelationshipWeight.default === "undefined" ? Object : _SourceRelationshipWeight.default)
], SourceRelationshipWeightArrayObject.prototype, "weight", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    _ts_metadata("design:type", Number)
], SourceRelationshipWeightArrayObject.prototype, "weightAvailableExcludingMe", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    _ts_metadata("design:type", Number)
], SourceRelationshipWeightArrayObject.prototype, "sackCountAvailableExcludingMe", void 0);
