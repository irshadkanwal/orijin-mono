"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FirestoreOrgnisationService", {
    enumerable: true,
    get: function() {
        return FirestoreOrgnisationService;
    }
});
const _common = require("@nestjs/common");
const _Organisation = /*#__PURE__*/ _interop_require_default(require("../entities/org/Organisation"));
const _firestoreOrmservice = require("./firestoreOrm.service");
const _Accounts = /*#__PURE__*/ _interop_require_default(require("../entities/org/Accounts"));
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
let FirestoreOrgnisationService = class FirestoreOrgnisationService {
    async getOne(id) {
        return {};
    }
    async createOrganisation(name, uniqueId, dbOps) {
        const newOrganisation = new _Organisation.default();
        if (uniqueId) {
            const existingOrganisation = await this.firestoreOrmService.getById(uniqueId, _Organisation.default);
            if (existingOrganisation) {
                throw new Error('An organisation already exists with above id. Please choose another.');
            }
            newOrganisation.setCustomId(uniqueId);
        }
        newOrganisation.name = name;
        newOrganisation.addAdmin(dbOps.currentUser);
        return this.firestoreOrmService.create(newOrganisation, dbOps);
    }
    async addOrganisationUser(organisationId, userId, dbOps, userObj) {
        let commitHere = false;
        if (!dbOps.tx) {
            dbOps.tx = this.firestoreOrmService.getTransaction();
            commitHere = true;
        }
        const user = userObj ?? await this.firestoreOrmService.getBy(userId, _Accounts.default, dbOps);
        console.log('user: ', user);
        if (!user) {
            throw new Error('User not found');
        }
        const organisation = await this.getOrganisation(organisationId);
        if (!organisation) {
            throw new Error('Organisation not found');
        }
        if (!user.hasOrganisation(organisation.id)) {
            console.log(`Org not added, adding ${organisationId.id} ${userId.labelShort}`);
            user.addOrganisation(organisation.id);
            await this.firestoreOrmService.update(user, dbOps);
        }
        if (!organisation.hasUser(user.id)) {
            console.log(`Adding user to org ${organisationId.id} ${userId.labelShort}`);
            organisation.addUser(user.id);
            await this.firestoreOrmService.update(organisation, dbOps);
        }
        if (commitHere) {
            await this.firestoreOrmService.commit(dbOps.tx);
        }
        return user;
    }
    constructor(firestoreOrmService){
        this.updateOrganisation = async (organisation, dbOps)=>{
            return await this.firestoreOrmService.update(organisation, dbOps);
        };
        this.getOrganisation = async (organisationId)=>{
            return this.firestoreOrmService.getBy(organisationId, _Organisation.default);
        };
        this.firestoreOrmService = firestoreOrmService;
    }
};
FirestoreOrgnisationService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _firestoreOrmservice.FirestoreOrmService === "undefined" ? Object : _firestoreOrmservice.FirestoreOrmService
    ])
], FirestoreOrgnisationService);
