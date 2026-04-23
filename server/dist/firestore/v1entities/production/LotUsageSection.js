"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return LotUsageSection;
    }
});
const _classtransformer = require("class-transformer");
const _ProcessingProperties = /*#__PURE__*/ _interop_require_default(require("./ProcessingProperties"));
const _SourceRelationshipWeightArrayObject = /*#__PURE__*/ _interop_require_default(require("../utis/SourceRelationshipWeightArrayObject"));
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
let LotUsageSection = class LotUsageSection {
    constructor(){
        this.processingProperties = new _ProcessingProperties.default();
    }
};
_ts_decorate([
    (0, _classtransformer.Type)(()=>_SourceRelationshipWeightArrayObject.default),
    _ts_metadata("design:type", typeof _SourceRelationshipWeightArrayObject.default === "undefined" ? Object : _SourceRelationshipWeightArrayObject.default)
], LotUsageSection.prototype, "source", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ProcessingProperties.default),
    _ts_metadata("design:type", typeof _ProcessingProperties.default === "undefined" ? Object : _ProcessingProperties.default)
], LotUsageSection.prototype, "processingProperties", void 0);
