"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return UserProvider;
    }
});
const _AccountV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/org/AccountV1"));
const _WorkspaceV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/org/WorkspaceV1"));
const _OrganisationV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/org/OrganisationV1"));
const _dbMappingUtils = require("../v1utils/dbMappingUtils");
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
let UserProvider = class UserProvider {
    async removeUser(userId, dbOps) {
        let commitHere = false;
        if (!dbOps.tx) {
            dbOps.tx = this.ormProvider.getTransaction();
            commitHere = true;
        }
        const user = await this.ormProvider.getBy(userId, _AccountV1.default);
        const [currentUserOrgs, workspacesPromise] = await Promise.all([
            user.organisations.map((o)=>this.ormProvider.getBy(o, _OrganisationV1.default)),
            user.workspaces.map((o)=>this.ormProvider.getBy(o, _WorkspaceV1.default))
        ]);
        const orgs = await Promise.all(currentUserOrgs);
        const workspaces = await Promise.all(workspacesPromise);
        for (const workspace of workspaces){
            if (workspace.hasUser(userId)) {
                workspace.removeUser(userId);
                await this.ormProvider.update(workspace, dbOps);
            }
        }
        for (const organisation of orgs){
            if (organisation.hasUser(userId)) {
                organisation.removeUser(userId);
                await this.ormProvider.update(organisation, dbOps);
            }
        }
        await this.ormProvider.delete(user.id, dbOps);
        await this.authProvider.removeUser(user.uid);
        if (commitHere) {
            await this.ormProvider.commit(dbOps.tx);
        }
    }
    constructor(ormProvider){
        this.isSuperUser = async (userId)=>{
            const user = await this.getUserById(userId);
            // filtered via. db can this be Model Object?
            console.log(user.email);
            const superUserObject = await this.ormProvider.all('superusers');
            console.log(superUserObject);
            if (superUserObject.length > 0 && superUserObject.some((su)=>su.email === user.email)) {
                return true;
            } else {
                return false;
            }
        };
        // isOrganisationAdmin = async (userId: ObjectId) => {
        //   const user = await this.getUserById(userId);
        //   if (user.organisation) {
        //     const organisation = await this.ormProvider.getBy(user.organisation.id, Organisation);
        //     if (organisation.admins.find(adminId => adminId.equals(userId))) {
        //       return true;
        //     }
        //   }
        //   return false;
        // };
        this.createAccount = async (uid, email, dbOps)=>{
            const newUser = new _AccountV1.default();
            newUser.setCustomId(uid);
            if (email) {
                newUser.email = email;
            }
            const baseUserPromise = await this.ormProvider.create(newUser, dbOps);
            if (email) {
                baseUserPromise.id.labelShort = email;
                baseUserPromise.id.label = email;
                await this.ormProvider.update(newUser, dbOps);
            }
            return baseUserPromise;
        };
        this.getAuthenticatedUser = async ()=>{
            const authUser = this.authProvider.user;
            if (!authUser) {
                throw new Error('User not logged in');
            }
            const baseUser = await this.ormProvider.getById(authUser.uid, _AccountV1.default);
            if (baseUser) {
                return baseUser;
            } else {
                return this.createAccount(authUser.uid, authUser.email, null);
            }
        };
        this.getUserById = async (userId)=>{
            const user = await this.ormProvider.getById(userId.id, _AccountV1.default);
            // let org = await this.ormProvider.getBy(<ObjectId>(<unknown>user.currentWorkspace), Workspace);
            // user.currentWorkspace = org;
            return user;
        };
        this.getUserByEmail = async (email)=>{
            const baseUser = await this.ormProvider.findSingle(_dbMappingUtils.collectionKeys.platformusers, 'email', email);
            const org = await this.ormProvider.getBy(baseUser.currentWorkspace, _WorkspaceV1.default);
            baseUser.currentWorkspace = org;
            return baseUser;
        };
        this.setUserCurrentWorkspace = async (workspaceId, dbOps)=>{
            const baseUser = await this.getAuthenticatedUser();
            baseUser.currentWorkspace = baseUser.workspaces.find((workspace)=>workspace.id === workspaceId.id);
            await this.ormProvider.update(baseUser, dbOps);
        };
        this.setUserGoogleCredentials = async (userId, credential, dbOps)=>{
            const baseUser = await this.getUserById(userId);
            if (credential) baseUser.googleApiCredential = credential;
            else baseUser.googleApiCredential = null;
            await this.ormProvider.update(baseUser, dbOps);
            return baseUser;
        };
        this.setUserCurrentOrganisation = async (dbOps, organisationId)=>{
            const baseUser = await this.getAuthenticatedUser();
            baseUser.currentOrganisation = organisationId ? baseUser.organisations.find((organisation)=>organisation.equals(organisationId)) : undefined;
            await this.ormProvider.update(baseUser, dbOps);
        };
        this.setUserLocale = async (locale, dbOps)=>{
            const baseUser = await this.getAuthenticatedUser();
            baseUser.locale = locale;
            await this.ormProvider.update(baseUser, dbOps);
        };
        this.updateUserName = async (name, dbOps)=>{
            const baseUser = await this.getAuthenticatedUser();
            baseUser.id.labelShort = baseUser.email;
            baseUser.id.label = baseUser.email;
            baseUser.name = name;
            await this.ormProvider.update(baseUser, dbOps);
        };
        this.getUserLocale = async ()=>{
            const baseUser = await this.getAuthenticatedUser();
            if (baseUser.locale) {
                return baseUser.locale;
            } else {
                await this.setUserLocale('en', null);
                return 'en';
            }
        };
        this.getUserCurrentWorkspace = async ()=>{
            const baseUser = await this.getAuthenticatedUser();
            if (baseUser && baseUser.currentWorkspace) {
                const currentWorkspace = await this.ormProvider.getBy(baseUser.currentWorkspace, _WorkspaceV1.default);
                return currentWorkspace;
            } else {
                return undefined;
            }
        };
        this.getUserCurrentOrganisation = async ()=>{
            const baseUser = await this.getAuthenticatedUser();
            if (baseUser && baseUser.currentOrganisation) {
                const currentOrg = await this.ormProvider.getBy(baseUser.currentOrganisation, _OrganisationV1.default);
                return currentOrg;
            } else {
                return undefined;
            }
        };
        this.ormProvider = ormProvider;
    }
};
UserProvider = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _OrmProvider.default === "undefined" ? Object : _OrmProvider.default
    ])
], UserProvider);
