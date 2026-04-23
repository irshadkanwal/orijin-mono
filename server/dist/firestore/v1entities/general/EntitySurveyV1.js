"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return EntitySurveyV1;
    }
});
const _dbMappingUtils = require("../../v1utils/dbMappingUtils");
const _classtransformer = require("class-transformer");
const _ObjectId = require("../utis/ObjectId");
const _AbstractEntity = require("../utis/AbstractEntity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let EntitySurveyV1 = class EntitySurveyV1 extends _AbstractEntity.AbstractEntity {
    getCollection() {
        return _dbMappingUtils.collectionKeys.surveys;
    }
    constructor(...args){
        super(...args);
        this.description = null;
        this.notes = null;
        this.entity = null;
        this.entityParent = null;
        this.parentAuditActivity = null;
    }
};
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], EntitySurveyV1.prototype, "entity", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], EntitySurveyV1.prototype, "entityParent", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], EntitySurveyV1.prototype, "parentAuditActivity", void 0);
