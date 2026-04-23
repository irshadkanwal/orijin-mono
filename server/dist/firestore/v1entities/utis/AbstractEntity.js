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
const _utils = require("../../v1utils/utils");
const _classtransformer = require("class-transformer");
const _ObjectId = require("./ObjectId");
const _ormAnnotations = require("../../v1utils/ormAnnotations");
const _Coordinates = /*#__PURE__*/ _interop_require_default(require("./Coordinates"));
const _types = require("./types");
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
let AbstractEntity = class AbstractEntity {
    get idString() {
        return this.id.idString;
    }
    removeDocument(item) {
        const index = this.documents.findIndex((a)=>a.storagePath === item.storagePath);
        this.documents.splice(index, 1);
    }
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
        this.approvalStatus = _types.ReviewStatus.NotSet;
        this.reviewStatus = _types.ReviewStatus.NotSet;
        this.creationStatus = _types.CreationStatus.NotSet;
        // systemStatus: FarmSystemStatus = null;
        this.isArchived = false;
        this.enabled = true;
        this.sourceSystem = null;
        this.meta_workspace = null;
        this.meta_organisation = null;
        this.meta_configkey = null;
        this.properties = {};
    }
};
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], AbstractEntity.prototype, "reviewEntityId", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], AbstractEntity.prototype, "documentReferences", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    (0, _ormAnnotations.expandFromId)('documentReferences'),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], AbstractEntity.prototype, "documentReferencesFull", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    (0, _ormAnnotations.cascadingDelete)(),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], AbstractEntity.prototype, "externalApprovals", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    (0, _ormAnnotations.expandFromId)('externalApprovals'),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], AbstractEntity.prototype, "externalApprovalsFull", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    (0, _ormAnnotations.cascadingDelete)(),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], AbstractEntity.prototype, "externalNotes", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    (0, _ormAnnotations.expandFromId)('externalNotes'),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], AbstractEntity.prototype, "externalNotesFull", void 0);
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
    (0, _classtransformer.Transform)(({ value })=>(0, _utils.formatDatesForFS)(value)),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], AbstractEntity.prototype, "lastActivityDate", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], AbstractEntity.prototype, "createdFromSubmission", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_types.ObjectIdUser),
    _ts_metadata("design:type", typeof _types.ObjectIdUser === "undefined" ? Object : _types.ObjectIdUser)
], AbstractEntity.prototype, "createdBy", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_types.ObjectIdUser),
    _ts_metadata("design:type", typeof _types.ObjectIdUser === "undefined" ? Object : _types.ObjectIdUser)
], AbstractEntity.prototype, "operatedBy", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_types.ObjectIdUser),
    _ts_metadata("design:type", typeof _types.ObjectIdUser === "undefined" ? Object : _types.ObjectIdUser)
], AbstractEntity.prototype, "updatedBy", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_Coordinates.default),
    _ts_metadata("design:type", typeof _Coordinates.default === "undefined" ? Object : _Coordinates.default)
], AbstractEntity.prototype, "createdLocation", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_Coordinates.default),
    _ts_metadata("design:type", typeof _Coordinates.default === "undefined" ? Object : _Coordinates.default)
], AbstractEntity.prototype, "updatedLocation", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    (0, _ormAnnotations.cascadingDelete)(),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], AbstractEntity.prototype, "surveys", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    (0, _ormAnnotations.expandFromId)('surveys'),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], AbstractEntity.prototype, "surveysFull", void 0);
