"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FirestoreUserService", {
    enumerable: true,
    get: function() {
        return FirestoreUserService;
    }
});
const _common = require("@nestjs/common");
const _Accounts = /*#__PURE__*/ _interop_require_default(require("../entities/org/Accounts"));
const _firestoreOrmservice = require("./firestoreOrm.service");
const _DbMappingUtils = require("../entities/utils/DbMappingUtils");
const _Workspace = /*#__PURE__*/ _interop_require_default(require("../entities/org/Workspace"));
const _Organisation = /*#__PURE__*/ _interop_require_default(require("../entities/org/Organisation"));
const _firebaseAuthservice = require("../firebaseAuth.service");
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
let FirestoreUserService = class FirestoreUserService {
    async removeUser(userId, dbOps) {
        let commitHere = false;
        if (!dbOps.tx) {
            dbOps.tx = this.firestoreOrmService.getTransaction();
            commitHere = true;
        }
        const user = await this.firestoreOrmService.getById(userId, _Accounts.default, dbOps);
        const [currentUserOrgs, workspacesPromise] = await Promise.all([
            user.organisations.map((o)=>this.firestoreOrmService.getBy(o, _Organisation.default)),
            user.workspaces.map((o)=>this.firestoreOrmService.getBy(o, _Workspace.default))
        ]);
        const orgs = await Promise.all(currentUserOrgs);
        const workspaces = await Promise.all(workspacesPromise);
        for (const workspace of workspaces){
            if (workspace.hasUser(user.id)) {
                workspace.removeUser(user.id);
                await this.firestoreOrmService.update(workspace, dbOps);
            }
        }
        for (const organisation of orgs){
            if (organisation.hasUser(user.id)) {
                organisation.removeUser(user.id);
                await this.firestoreOrmService.update(organisation, dbOps);
            }
        }
        await this.firestoreOrmService.delete(user.id, dbOps);
        await this.firestoreAuthService.removeUser(user.uid);
        if (commitHere) {
            await this.firestoreOrmService.commit(dbOps.tx);
        }
    }
    constructor(firestoreOrmService, firebaseAuthService){
        this.isSuperUser = async (userId)=>{
            const user = await this.getUserById(userId);
            const superUserObject = await this.firestoreOrmService.all('superusers');
            if (superUserObject.length > 0 && superUserObject.some((su)=>su.email === user.email)) {
                return true;
            } else {
                return false;
            }
        };
        this.getUserById = async (userId)=>{
            const user = await this.firestoreOrmService.getById(userId.id, _Accounts.default);
            return user;
        };
        this.getUserByEmail = async (email)=>{
            const baseUser = await this.firestoreOrmService.findSingle(_DbMappingUtils.collectionKeys.platformusers, 'email', email);
            const org = await this.firestoreOrmService.getBy(baseUser.currentWorkspace, _Workspace.default);
            baseUser.currentWorkspace = org;
            return baseUser;
        };
        this.createAccount = async (uid, email, dbOps)=>{
            const newUser = new _Accounts.default();
            newUser.setCustomId(uid);
            if (email) {
                newUser.email = email;
            }
            const baseUserPromise = await this.firestoreOrmService.create(newUser, dbOps);
            if (email) {
                baseUserPromise.id.labelShort = email;
                baseUserPromise.id.label = email;
                await this.firestoreOrmService.update(newUser, dbOps);
            }
            return baseUserPromise;
        };
        this.updateUser = async (user, dbOps)=>{
            return await this.firestoreOrmService.update(user, dbOps);
        };
        this.updateUserName = async (id, name, dbOps)=>{
            const baseUser = await this.firestoreOrmService.getById(id, _Accounts.default);
            baseUser.id.labelShort = baseUser.email;
            baseUser.id.label = baseUser.email;
            baseUser.name = name;
            await this.firestoreOrmService.update(baseUser, dbOps);
        };
        this.firestoreAuthService = firebaseAuthService;
        this.firestoreOrmService = firestoreOrmService;
    }
};
FirestoreUserService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _firestoreOrmservice.FirestoreOrmService === "undefined" ? Object : _firestoreOrmservice.FirestoreOrmService,
        typeof _firebaseAuthservice.FirebaseAuthService === "undefined" ? Object : _firebaseAuthservice.FirebaseAuthService
    ])
], FirestoreUserService);
