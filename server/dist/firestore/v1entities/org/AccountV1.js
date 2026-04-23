"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return AccountV1;
    }
});
const _classtransformer = require("class-transformer");
const _dbMappingUtils = require("../../v1utils/dbMappingUtils");
const _ObjectId = require("../utis/ObjectId");
const _AbstractEntity = require("../utis/AbstractEntity");
const _GoogleApiCredential = /*#__PURE__*/ _interop_require_default(require("../utis/GoogleApiCredential"));
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
let AccountV1 = class AccountV1 extends _AbstractEntity.AbstractEntity {
    get isGoogleConnected() {
        // if (this.googleApiCredential) {
        //   if (
        //     moment(moment()).isSameOrBefore(
        //       new Date((this.googleApiCredential as any).expiryDate),
        //     )
        //   ) {
        //     return true;
        //   }
        // }
        // return false;
        throw Error('todo');
    }
    getCollection() {
        return _dbMappingUtils.collectionKeys.platformusers;
    }
    addWorkspace(workspace) {
        this.workspaces.push(workspace);
    }
    setWorkspaceRole(workspaceId, role) {
        this.workspaceRole[workspaceId.id] = role;
    }
    removeWorkspace(workspaceId) {
        this.workspaces = this.workspaces.filter((workspace)=>!workspace.equals(workspaceId));
    }
    hasWorkSpace(workspaceId) {
        const item = this.workspaces.find((b)=>{
            return b.equals(workspaceId);
        });
        return item != undefined;
    }
    addOrganisation(organisation) {
        this.organisations.push(organisation);
    }
    removeOrganisation(organisationId) {
        this.organisations = this.organisations.filter((organisation)=>!organisation.equals(organisationId));
    }
    hasOrganisation(organisationId) {
        const item = this.organisations.find((b)=>{
            return b.equals(organisationId);
        });
        return item != undefined;
    }
    constructor(...args){
        super(...args);
        this.organisations = [];
        this.workspaces = [];
        this.workspaceRole = {};
        this.currentWorkspace = null;
        this.currentOrganisation = null;
        this.locale = null;
        this.email = null;
        this.uid = null;
        this.name = null;
        this.photoURL = null;
        this.googleApiCredential = null;
    }
};
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], AccountV1.prototype, "organisations", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], AccountV1.prototype, "workspaces", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>Object),
    _ts_metadata("design:type", typeof Record === "undefined" ? Object : Record)
], AccountV1.prototype, "workspaceRole", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], AccountV1.prototype, "currentWorkspace", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], AccountV1.prototype, "currentOrganisation", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_GoogleApiCredential.default),
    _ts_metadata("design:type", Object)
], AccountV1.prototype, "googleApiCredential", void 0);
