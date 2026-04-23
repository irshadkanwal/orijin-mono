"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return OrganisationProvider;
    }
});
const _UserProvider = /*#__PURE__*/ _interop_require_default(require("./UserProvider"));
const _WorkspaceProvider = /*#__PURE__*/ _interop_require_default(require("./WorkspaceProvider"));
const _OrganisationV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/org/OrganisationV1"));
const _AccountV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/org/AccountV1"));
const _WorkspaceV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/org/WorkspaceV1"));
const _common = require("@nestjs/common");
const _OrmProvider = /*#__PURE__*/ _interop_require_default(require("./OrmProvider"));
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
let OrganisationProvider = class OrganisationProvider {
    async createOrganisation(name, uniqueId, dbOps) {
        const newOrganisation = new _OrganisationV1.default();
        if (uniqueId) {
            const existingOrganisation = await this._ormProvider.getById(uniqueId, _OrganisationV1.default);
            if (existingOrganisation) {
                throw new Error('An organisation already exists with above id. Please choose another.');
            }
            newOrganisation.setCustomId(uniqueId);
        }
        newOrganisation.name = name;
        return this._ormProvider.create(newOrganisation, dbOps);
    }
    async addOrganisationUser(organisationId, userId, dbOps) {
        console.log(`Add org start ${organisationId.id} ${userId.email}`);
        let commitHere = false;
        if (!dbOps.tx) {
            dbOps.tx = this._ormProvider.getTransaction();
            commitHere = true;
        }
        const user = await this._ormProvider.getBy(userId, _AccountV1.default, dbOps);
        const organisation = await this.getOrganisation(organisationId);
        console.log('Add org to user new');
        if (!user.hasOrganisation(organisation.id)) {
            console.log(`Org not added, adding ${organisationId.id} ${userId.labelShort}`);
            user.addOrganisation(organisation.id);
            await this._ormProvider.update(user, dbOps);
        }
        if (!organisation.hasUser(user.id)) {
            console.log(`Adding user to org ${organisationId.id} ${userId.labelShort}`);
            organisation.addUser(user.id);
            await this._ormProvider.update(organisation, dbOps);
        }
        if (commitHere) {
            await this._ormProvider.commit(dbOps.tx);
        }
        return user;
    }
    async removeOrganisationUser(organisationId, userId, dbOps) {
        const user = await this._ormProvider.getBy(userId, _AccountV1.default);
        let commitHere = false;
        if (!dbOps.tx) {
            dbOps.tx = this._ormProvider.getTransaction();
            commitHere = true;
        }
        const organisation = await this.getOrganisation(organisationId);
        if (organisation.hasAdmin(userId)) {
            await this.removeOrganisationAdmin(organisationId, userId, dbOps);
        }
        if (user.hasOrganisation(organisationId)) {
            user.removeOrganisation(organisation.id);
            if (user.currentWorkspace) {
                if (organisation.workspaces.find((workspace)=>workspace.equals(user.currentWorkspace))) {
                    user.currentWorkspace = null;
                }
            }
            await this._ormProvider.update(user, dbOps);
        }
        const workspaces = await Promise.all(user.workspaces.map((o)=>this._ormProvider.getBy(o, _WorkspaceV1.default)));
        for (const workspace of workspaces){
            if (workspace && workspace.organisation.equals(organisationId)) {
                this.workspaceProvider.removeWorkspaceUser(workspace.id, user.id, dbOps);
            }
        }
        if (organisation.hasUser(userId)) {
            organisation.removeUser(userId);
            await this._ormProvider.update(organisation, dbOps);
        }
        if (commitHere) {
            await this._ormProvider.commit(dbOps.tx);
        }
    }
    async removeOrganisation(organisationId, dbOps) {
        const organisation = await this.getOrganisation(organisationId);
        if (organisation) {
            await this._ormProvider.delete(organisation.id, dbOps);
        }
    }
    async addOrganisationAdmin(organisationId, userId, dbOps) {
        const organisation = await this.getOrganisation(organisationId);
        const user = await this._ormProvider.getById(userId.id, _AccountV1.default, dbOps);
        let commitHere = false;
        if (!dbOps.tx) {
            dbOps.tx = this._ormProvider.getTransaction();
            commitHere = true;
        }
        if (!organisation.hasAdmin(user.id)) {
            organisation.addAdmin(user.id);
            await this._ormProvider.update(organisation, dbOps);
        }
        for (const workspace of organisation.workspaces){
            await this.workspaceProvider.addWorkspaceUser(workspace, user.id, dbOps);
        }
        if (commitHere) {
            await this._ormProvider.commit(dbOps.tx);
        }
    }
    async removeOrganisationAdmin(organisationId, userId, dbOps) {
        const organisation = await this.getOrganisation(organisationId);
        const user = await this._userProvider.getUserById(userId);
        let commitHere = false;
        if (!dbOps.tx) {
            dbOps.tx = this._ormProvider.getTransaction();
            commitHere = true;
        }
        if (organisation.hasAdmin(user.id)) {
            organisation.removeAdmin(user.id);
            await this._ormProvider.update(organisation, dbOps);
        }
        if (commitHere) {
            await this._ormProvider.commit(dbOps.tx);
        }
    }
    constructor(ormProvider, userProvider, workspaceProvider){
        this.getOrganisation = async (organisationId)=>{
            return this._ormProvider.getBy(organisationId, _OrganisationV1.default);
        };
        this.updatedOrganisation = async (organisation)=>{
            return this._ormProvider.update(organisation);
        };
        this._ormProvider = ormProvider;
        this._userProvider = userProvider;
        this.workspaceProvider = workspaceProvider;
    }
};
OrganisationProvider = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _OrmProvider.default === "undefined" ? Object : _OrmProvider.default,
        typeof _UserProvider.default === "undefined" ? Object : _UserProvider.default,
        typeof _WorkspaceProvider.default === "undefined" ? Object : _WorkspaceProvider.default
    ])
], OrganisationProvider);
