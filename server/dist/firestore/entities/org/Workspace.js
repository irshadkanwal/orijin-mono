"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return Workspace;
    }
});
const _classtransformer = require("class-transformer");
const _AbstractEntity = require("../utils/AbstractEntity");
const _ObjectId = require("../utils/ObjectId");
const _DbMappingUtils = require("../utils/DbMappingUtils");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let Workspace = class Workspace extends _AbstractEntity.AbstractEntity {
    getCollection() {
        return _DbMappingUtils.collectionKeys.workspaces;
    }
    addUser(user) {
        this.users.push(user);
    }
    removeUser(userId) {
        this.users = this.users.filter((user)=>!user.equals(userId));
    }
    hasUser(id) {
        const item = this.users.find((b)=>{
            return b.equals(id);
        });
        return item !== undefined;
    }
    constructor(...args){
        super(...args);
        this.users = [];
    }
};
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], Workspace.prototype, "createdBy", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], Workspace.prototype, "updatedBy", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], Workspace.prototype, "organisation", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], Workspace.prototype, "users", void 0);
