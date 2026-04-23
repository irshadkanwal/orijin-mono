"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FirestoreWorkspaceService", {
    enumerable: true,
    get: function() {
        return FirestoreWorkspaceService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("../entities/utils/utils");
const _firestoreOrmservice = require("./firestoreOrm.service");
const _Organisation = /*#__PURE__*/ _interop_require_default(require("../entities/org/Organisation"));
const _Workspace = /*#__PURE__*/ _interop_require_default(require("../entities/org/Workspace"));
const _Accounts = /*#__PURE__*/ _interop_require_default(require("../entities/org/Accounts"));
const _dbMappingUtils = require("../v1utils/dbMappingUtils");
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
let FirestoreWorkspaceService = class FirestoreWorkspaceService {
    async createWorkspace(name, configPrefix, organisationId, uniqueId, dbOps, organisationObj = undefined) {
        const organisation = organisationObj || await this._firestoreOrmService.getBy(organisationId, _Organisation.default, dbOps);
        const newWorkspace = new _Workspace.default();
        newWorkspace.name = name;
        newWorkspace.organisation = organisationId;
        newWorkspace.configPrefix = configPrefix;
        newWorkspace.setCustomId(uniqueId);
        let commitHere = false;
        if (!dbOps?.tx?.transaction) {
            dbOps.tx = this._firestoreOrmService.getTransaction();
            commitHere = true;
        }
        if (uniqueId) {
            const dup = await this._firestoreOrmService.getById(uniqueId, _Workspace.default, dbOps);
            if (dup) {
                throw new Error('workspace with id already exists: ' + uniqueId);
            }
            newWorkspace.setCustomId(uniqueId);
        } else {
            const id = organisationId.id + '_' + (0, _utils.createUniqueIdOfName)(name);
            const dup = await this._firestoreOrmService.getById(id, _Workspace.default, dbOps);
            if (dup) {
                throw new Error('workspace with id already exists: ' + id);
            }
            newWorkspace.setCustomId(id);
        }
        const newWorkspaceResponse = await this._firestoreOrmService.create(newWorkspace, dbOps);
        await Promise.all(organisation.admins.map((admin)=>{
            return this.addWorkspaceUser(newWorkspaceResponse.id, admin, dbOps, newWorkspaceResponse, true);
        }));
        organisation.addWorkspace(newWorkspaceResponse.id);
        await this._firestoreOrmService.update(organisation, dbOps);
        if (commitHere) {
            await this._firestoreOrmService.commit(dbOps.tx);
        }
        return newWorkspaceResponse;
    }
    async addWorkspaceUser(workspaceId, userId, dbOps, workspaceObj = undefined, isRoleAdd = false, userObj = undefined) {
        let commitHere = false;
        if (!dbOps?.tx?.transaction) {
            dbOps.tx = this._firestoreOrmService.getTransaction();
            commitHere = true;
        }
        const user = userObj ?? await this._firestoreOrmService.getBy(userId, _Accounts.default, dbOps);
        const workspace = workspaceObj ?? await this._firestoreOrmService.getBy(workspaceId, _Workspace.default, dbOps);
        if (!workspace.hasUser(user.id)) {
            console.log(`Workspace not added, adding ${workspaceId.id} ${userId.labelShort}`);
            workspace.addUser(user.id);
            await this._firestoreOrmService.update(workspace, dbOps);
        }
        if (!user.hasWorkSpace(workspace.id)) {
            console.log(`Adding workspace to user ${workspaceId.id} ${userId.labelShort}`);
            user.addWorkspace(workspace.id);
            await this._firestoreOrmService.update(user, dbOps);
        }
        if (!user.hasOrganisation(workspace.organisation)) {
            console.log(`Adding organisation to user ${workspaceId.id} ${userId.labelShort}`);
            user.addOrganisation(workspace.organisation);
            await this._firestoreOrmService.update(user, dbOps);
        }
        if (isRoleAdd) {
            await this.addWorkspaceUserRole({
                workspace,
                role: 'adminAll',
                user
            }, dbOps);
        }
        if (commitHere) {
            await this._firestoreOrmService.commit(dbOps.tx);
        }
    }
    async addWorkspaceUserRole(roleParams, dbOps) {
        roleParams.user.setWorkspaceRole(roleParams.workspace.id, roleParams.role);
        const resp = await this._firestoreOrmService.update(roleParams.user, dbOps);
        return resp;
    }
    async getWorkspaceById(id, dbOps) {
        return await this._firestoreOrmService.getById(id, _Workspace.default, dbOps);
    }
    async getAllWorkspaceByOrganisationId(id) {
        const filters = [];
        if (id) {
            filters.push({
                key: 'organisation',
                value: {
                    id: id,
                    refcollection: _dbMappingUtils.collectionKeys.organisations,
                    isPreviousVersion: false
                },
                operation: '=='
            });
        }
        const data = await this._firestoreOrmService.searchBy(_Workspace.default, {
            filters
        });
        // console.log(data.values);
        return data.values;
    }
    constructor(firestoreOrmService){
        this._firestoreOrmService = firestoreOrmService;
    }
};
FirestoreWorkspaceService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _firestoreOrmservice.FirestoreOrmService === "undefined" ? Object : _firestoreOrmservice.FirestoreOrmService
    ])
], FirestoreWorkspaceService);
