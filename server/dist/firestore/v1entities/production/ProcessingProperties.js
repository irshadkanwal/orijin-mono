"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return ProcessingProperties;
    }
});
const _classtransformer = require("class-transformer");
const _ObjectId = require("../utis/ObjectId");
const _utils = require("../../v1utils/utils");
const _AmountUnit = /*#__PURE__*/ _interop_require_default(require("../utis/AmountUnit"));
const _PriceContainer = /*#__PURE__*/ _interop_require_default(require("../utis/PriceContainer"));
const _SacksContainer = /*#__PURE__*/ _interop_require_default(require("./SacksContainer"));
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
let ProcessingProperties = class ProcessingProperties {
    setPrimaryProperty(key, value) {
        const flexible = this;
        flexible[key] = value;
    }
    getProperty(key) {
        return this.properties[key];
    }
    setProperty(key, value) {
        this.properties[key] = value;
    }
    constructor(){
        this.activityStartDateTime = null;
        this.activityEndDateTime = null;
        this.properties = {};
    }
};
_ts_decorate([
    (0, _classtransformer.Transform)(({ value })=>(0, _utils.formatDatesForFS)(value)),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], ProcessingProperties.prototype, "activityStartDateTime", void 0);
_ts_decorate([
    (0, _classtransformer.Transform)(({ value })=>(0, _utils.formatDatesForFS)(value)),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], ProcessingProperties.prototype, "activityEndDateTime", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], ProcessingProperties.prototype, "originCollector", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_PriceContainer.default),
    _ts_metadata("design:type", typeof _PriceContainer.default === "undefined" ? Object : _PriceContainer.default)
], ProcessingProperties.prototype, "pricePerWeight", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], ProcessingProperties.prototype, "sackType", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], ProcessingProperties.prototype, "producer", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_AmountUnit.default),
    _ts_metadata("design:type", typeof _AmountUnit.default === "undefined" ? Object : _AmountUnit.default)
], ProcessingProperties.prototype, "money", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], ProcessingProperties.prototype, "location", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], ProcessingProperties.prototype, "locationParent", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_SacksContainer.default),
    _ts_metadata("design:type", typeof _SacksContainer.default === "undefined" ? Object : _SacksContainer.default)
], ProcessingProperties.prototype, "sacks", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], ProcessingProperties.prototype, "targetBin", void 0);
