"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return VarietyV1;
    }
});
const _dbMappingUtils = require("../../v1utils/dbMappingUtils");
const _AbstractEntity = require("../utis/AbstractEntity");
const _ObjectId = require("../utis/ObjectId");
const _CropV1 = /*#__PURE__*/ _interop_require_default(require("./CropV1"));
const _ormAnnotations = require("../../v1utils/ormAnnotations");
const _classtransformer = require("class-transformer");
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
let VarietyV1 = class VarietyV1 extends _AbstractEntity.AbstractEntity {
    getCollection() {
        return _dbMappingUtils.collectionKeys.varieties;
    }
    constructor(name){
        super();
        this.name = null;
        this.grade = null;
        this.organic = false;
        this.dry = false;
        this.crop = null;
        this.cropFull = null;
        this.name = name;
    }
};
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], VarietyV1.prototype, "crop", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    (0, _ormAnnotations.expandFromId)('mainCrop'),
    _ts_metadata("design:type", typeof _CropV1.default === "undefined" ? Object : _CropV1.default)
], VarietyV1.prototype, "cropFull", void 0);
