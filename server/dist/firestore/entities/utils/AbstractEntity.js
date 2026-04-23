"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AbstractEntity", {
    enumerable: true,
    get: function() {
        return AbstractEntity;
    }
});
const _classtransformer = require("class-transformer");
const _ObjectId = require("./ObjectId");
const _utils = require("./utils");
const _types = require("./types");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AbstractEntity = class AbstractEntity {
    setId(id) {
        this.id = new _ObjectId.ObjectId(id, this.getCollection());
    }
    setCustomId(id) {
        this.setProperty('customId', id);
    }
    setProperty(key, value) {
        this.properties[key] = value;
    }
    constructor(){
        this.isDeleted = false;
        this.isArchived = false;
        this.enabled = true;
        this.properties = {};
    }
};
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], AbstractEntity.prototype, "id", void 0);
_ts_decorate([
    (0, _classtransformer.Transform)(({ value })=>(0, _utils.formatDatesForFS)(value)),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], AbstractEntity.prototype, "createdDate", void 0);
_ts_decorate([
    (0, _classtransformer.Transform)(({ value })=>(0, _utils.formatDatesForFS)(value)),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], AbstractEntity.prototype, "updatedDate", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_types.ObjectIdUser),
    _ts_metadata("design:type", typeof _types.ObjectIdUser === "undefined" ? Object : _types.ObjectIdUser)
], AbstractEntity.prototype, "createdBy", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_types.ObjectIdUser),
    _ts_metadata("design:type", typeof _types.ObjectIdUser === "undefined" ? Object : _types.ObjectIdUser)
], AbstractEntity.prototype, "updatedBy", void 0);
