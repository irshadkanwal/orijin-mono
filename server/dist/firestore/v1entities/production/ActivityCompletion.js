"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return ActivityCompletion;
    }
});
const _classtransformer = require("class-transformer");
const _ormAnnotations = require("../../v1utils/ormAnnotations");
const _ObjectId = require("../utis/ObjectId");
const _AbstractLot = /*#__PURE__*/ _interop_require_default(require("./AbstractLot"));
const _OriginProperties = /*#__PURE__*/ _interop_require_default(require("./OriginProperties"));
const _dbMappingUtils = require("../../v1utils/dbMappingUtils");
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
let ActivityCompletion = class ActivityCompletion extends _AbstractLot.default {
    // constructor() {
    //   super();
    // }
    getCollection() {
        return _dbMappingUtils.collectionKeys.activitycompletions;
    }
    constructor(...args){
        super(...args);
        this.activityName = null;
        this.endState = null;
        this.activityType = null;
    }
};
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], ActivityCompletion.prototype, "parentId", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], ActivityCompletion.prototype, "originPropertiesId", void 0);
_ts_decorate([
    (0, _ormAnnotations.expandFromId)('originPropertiesId'),
    (0, _classtransformer.Exclude)(),
    _ts_metadata("design:type", typeof _OriginProperties.default === "undefined" ? Object : _OriginProperties.default)
], ActivityCompletion.prototype, "originProperties", void 0);
