"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FirestoreOrganisationConfig", {
    enumerable: true,
    get: function() {
        return FirestoreOrganisationConfig;
    }
});
const _common = require("@nestjs/common");
const _firestoreOrmservice = require("./firestoreOrm.service");
const _OrganisationConfiguration = /*#__PURE__*/ _interop_require_default(require("../entities/org/OrganisationConfiguration"));
const _firestoreWorkspaceservice = require("./firestoreWorkspace.service");
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
let FirestoreOrganisationConfig = class FirestoreOrganisationConfig {
    async getOrganisationConfig(org) {
        try {
            const organisationConfig = await this.firestoreOrmService.getById(org.id, _OrganisationConfiguration.default);
            if (!organisationConfig) {
                return {};
            }
            return organisationConfig;
        } catch (error) {
            this.logger.error('Error retrieving document:', error);
            throw new _common.InternalServerErrorException('Failed to retrieve document');
        }
    }
    async updateOrganisationConfig(org, data, dbOps) {
        let commitHere = false;
        if (!dbOps.tx) {
            dbOps.tx = this.firestoreOrmService.getTransaction();
            commitHere = true;
        }
        const currentConfig = await this.firestoreOrmService.getById(org.id, _OrganisationConfiguration.default);
        if (!currentConfig) {
            throw new _common.NotFoundException('Document does not exist');
        }
        try {
            if (data.locality) {
                currentConfig.config.locality = data.locality;
            }
            if (data.general) {
                const workspaces = await this.firestoreWorkspaceService.getAllWorkspaceByOrganisationId(org.id);
                if (data.general.masterWorkspace) {
                    data.general.masterWorkspace = this.getValidWorkspaceId(workspaces, data.general.masterWorkspace);
                }
                if (data.general.testWorkspace) {
                    data.general.testWorkspace = this.getValidWorkspaceId(workspaces, data.general.testWorkspace);
                }
                currentConfig.config.general = data.general;
            }
            await this.firestoreOrmService.update(currentConfig, dbOps);
            if (commitHere) {
                await this.firestoreOrmService.commit(dbOps.tx);
            }
            return currentConfig;
        } catch (error) {
            this.logger.error('Error updating document:', error);
            throw new _common.InternalServerErrorException('Failed to update document');
        }
    }
    getValidWorkspaceId(workspaces, workspaceId) {
        const foundWorkspace = workspaces.find((workspace)=>workspace?.properties?.customId.toLowerCase() === workspaceId.toLowerCase());
        return foundWorkspace ? foundWorkspace.properties.customId : workspaceId;
    }
    constructor(firestoreOrmService, firestoreWorkspaceService){
        this.firestoreOrmService = firestoreOrmService;
        this.firestoreWorkspaceService = firestoreWorkspaceService;
        this.logger = new _common.Logger(FirestoreOrganisationConfig.name);
    }
};
FirestoreOrganisationConfig = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _firestoreOrmservice.FirestoreOrmService === "undefined" ? Object : _firestoreOrmservice.FirestoreOrmService,
        typeof _firestoreWorkspaceservice.FirestoreWorkspaceService === "undefined" ? Object : _firestoreWorkspaceservice.FirestoreWorkspaceService
    ])
], FirestoreOrganisationConfig);
