"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return VarietyPriceContainer;
    }
});
const _classtransformer = require("class-transformer");
const _ObjectId = require("./ObjectId");
const _PriceContainer = /*#__PURE__*/ _interop_require_default(require("./PriceContainer"));
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
let VarietyPriceContainer = class VarietyPriceContainer {
    constructor(){
        this.price = null;
    }
};
_ts_decorate([
    (0, _classtransformer.Type)(()=>_PriceContainer.default),
    _ts_metadata("design:type", typeof _PriceContainer.default === "undefined" ? Object : _PriceContainer.default)
], VarietyPriceContainer.prototype, "price", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], VarietyPriceContainer.prototype, "variety", void 0);
