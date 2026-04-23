"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return AnimalCount;
    }
});
const _classtransformer = require("class-transformer");
const _dbMappingUtils = require("../../v1utils/dbMappingUtils");
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
let AnimalCount = class AnimalCount extends _AbstractEntity.AbstractEntity {
    getCollection() {
        return _dbMappingUtils.collectionKeys.animalcounts;
    }
    constructor(...args){
        super(...args);
        this.type = null;
        this.count = null;
        this.isOrganic = null;
        this.usedForManure = null;
        this.description = null;
        this.notes = null;
        this.entity = null;
    }
};
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], AnimalCount.prototype, "entity", void 0);
