"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return WorkspaceProvider;
    }
});
const _utils = require("../v1utils/utils");
const _WorkspaceV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/org/WorkspaceV1"));
const _OrganisationV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/org/OrganisationV1"));
const _AccountV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/org/AccountV1"));
const _OrmProvider = /*#__PURE__*/ _interop_require_default(require("./OrmProvider"));
const _common = require("@nestjs/common");
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
let WorkspaceProvider = class WorkspaceProvider {
    async createWorkspace(name, configPrefix, organisationId, uniqueId, dbOps) {
        const organisation = await this._ormProvider.getBy(organisationId, _OrganisationV1.default, dbOps);
        const newWorkspace = new _WorkspaceV1.default();
        newWorkspace.name = name;
        newWorkspace.organisation = organisationId;
        newWorkspace.configPrefix = configPrefix;
        let commitHere = false;
        if (!dbOps.tx) {
            dbOps.tx = this._ormProvider.getTransaction();
            commitHere = true;
        }
        if (uniqueId) {
            const dup = await this._ormProvider.getById(uniqueId, _WorkspaceV1.default, dbOps);
            if (dup) {
                throw new Error('workspace with id already exists: ' + uniqueId);
            }
            newWorkspace.setCustomId(uniqueId);
        } else {
            const id = organisationId.id + '_' + (0, _utils.createUniqueIdOfName)(name);
            const dup = await this._ormProvider.getById(id, _WorkspaceV1.default, dbOps);
            if (dup) {
                throw new Error('workspace with id already exists: ' + id);
            }
            newWorkspace.setCustomId(id);
        }
        const newWorkspaceResponse = await this._ormProvider.create(newWorkspace, dbOps);
        await Promise.all(organisation.admins.map((admin)=>{
            return this.addWorkspaceUser(newWorkspaceResponse.id, admin, dbOps);
        }));
        organisation.addWorkspace(newWorkspaceResponse.id);
        await this._ormProvider.update(organisation, dbOps);
        if (commitHere) {
            await this._ormProvider.commit(dbOps.tx);
        }
        return newWorkspaceResponse;
    }
    async updateUserWithRole(roleParams, dbOps) {
        let commitHere = false;
        if (!dbOps.tx) {
            dbOps.tx = this._ormProvider.getTransaction();
            commitHere = true;
        }
        console.log('updateUserWithRole role', roleParams);
        roleParams.user.setWorkspaceRole(roleParams.workspace.id, roleParams.role);
        await this._ormProvider.update(roleParams.user, dbOps);
        console.log('updateUserWithRol, update user', roleParams);
        const baseUser = await this._ormProvider.getBy(roleParams.user.id, _AccountV1.default, dbOps);
        baseUser.id.labelShort = baseUser.email;
        baseUser.id.label = baseUser.email;
        baseUser.name = roleParams.name;
        await this._ormProvider.update(baseUser, dbOps);
        if (commitHere) {
            await this._ormProvider.commit(dbOps.tx);
        }
    }
    async addWorkspaceUserRole(roleParams, dbOps) {
        console.log('adding role ', roleParams);
        roleParams.user.setWorkspaceRole(roleParams.workspace.id, roleParams.role);
        await this._ormProvider.update(roleParams.user, dbOps);
    }
    async addWorkspaceUser(workspaceId, userId, dbOps) {
        const user = await this._ormProvider.getBy(userId, _AccountV1.default, dbOps);
        const workspace = await this._ormProvider.getBy(workspaceId, _WorkspaceV1.default, dbOps);
        console.log('addWorkspaceUser');
        let commitHere = false;
        if (!dbOps?.tx) {
            dbOps.tx = this._ormProvider.getTransaction();
            commitHere = true;
        }
        if (!workspace.hasUser(user.id)) {
            console.log(`Workspace not added, adding ${workspaceId.id} ${userId.labelShort}`);
            workspace.addUser(user.id);
            await this._ormProvider.update(workspace, dbOps);
        }
        if (!user.hasWorkSpace(workspace.id)) {
            console.log(`Adding workspace to user ${workspaceId.id} ${userId.labelShort}`);
            user.addWorkspace(workspace.id);
            await this._ormProvider.update(user, dbOps);
        }
        if (commitHere) {
            await this._ormProvider.commit(dbOps.tx);
        }
    }
    async removeWorkspaceUser(workspaceId, userId, dbOps) {
        try {
            console.log(workspaceId, userId);
            const workspaceObject = await this.getWorkspace(workspaceId);
            const userObject = await this._ormProvider.getBy(userId, _AccountV1.default, dbOps);
            let commitHere = false;
            if (!dbOps.tx) {
                dbOps.tx = this._ormProvider.getTransaction();
                commitHere = true;
            }
            if (userObject) {
                userObject.removeWorkspace(workspaceObject.id);
                await this._ormProvider.update(userObject, dbOps);
            } else {
                console.warn(`Something is wrong, user object can't be found with ${JSON.stringify(userId)}`);
            }
            if (workspaceObject && userObject) {
                workspaceObject.removeUser(userObject.id);
                await this._ormProvider.update(workspaceObject, dbOps);
            } else {
                console.warn(`Something is wrong, workspaceObject can't be found with ${JSON.stringify(workspaceId)}`);
            }
            if (commitHere) {
                await this._ormProvider.commit(dbOps.tx);
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async removeWorkspace(workspaceId, dbOps) {
        const workspace = await this.getWorkspace(workspaceId);
        const organisation = await this._ormProvider.getBy(workspace.organisation, _OrganisationV1.default, dbOps);
        let commitHere = false;
        if (!dbOps.tx) {
            dbOps.tx = this._ormProvider.getTransaction();
            commitHere = true;
        }
        for (const userId of workspace.users){
            await this.removeWorkspaceUser(workspace.id, userId, dbOps);
        }
        organisation.removeWorkspace(workspace.id);
        await this._ormProvider.update(organisation, dbOps);
        await this._ormProvider.delete(workspaceId, dbOps);
        if (commitHere) {
            await this._ormProvider.commit(dbOps.tx);
        }
    }
    constructor(ormProvider){
        this.getWorkspace = async (workspaceId)=>{
            return this._ormProvider.getBy(workspaceId, _WorkspaceV1.default);
        };
        this.getWorkspaceConfigPrefix = async (workspaceId)=>{
            const workspace = await this.getWorkspace(workspaceId);
            return workspace.configPrefix;
        };
        this._ormProvider = ormProvider;
    }
};
WorkspaceProvider = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _OrmProvider.default === "undefined" ? Object : _OrmProvider.default
    ])
], WorkspaceProvider);
