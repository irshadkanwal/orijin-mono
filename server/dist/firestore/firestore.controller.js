"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FirestoreController", {
    enumerable: true,
    get: function() {
        return FirestoreController;
    }
});
const _firestoreUserservice = require("./services/firestoreUser.service");
const _common = require("@nestjs/common");
const _firestorefarmInspectiondto = require("./dto/firestore.farmInspection.dto");
const _firestoreservice = require("./firestore.service");
const _firestoreuserdto = require("./dto/firestore.user.dto");
const _firestorefarminspectionservice = require("./firestore.farm.inspection.service");
const _firebaseAuthservice = require("./firebaseAuth.service");
const _express = require("express");
const _firestoreusersfilterdto = require("./dto/firestore.users.filter.dto");
const _sendgridservice = require("../common/service/send-grid/send-grid.service");
const _constants = require("../common/constants");
const _firestoreOrgnisationservice = require("./services/firestoreOrgnisation.service");
const _Organisation = /*#__PURE__*/ _interop_require_default(require("./entities/org/Organisation"));
const _utils = require("./entities/utils/utils");
const _firestoreWorkspaceservice = require("./services/firestoreWorkspace.service");
const _Workspace = /*#__PURE__*/ _interop_require_default(require("./entities/org/Workspace"));
const _Accounts = /*#__PURE__*/ _interop_require_default(require("./entities/org/Accounts"));
const _firestoreOrmservice = require("./services/firestoreOrm.service");
const _ObjectId = require("./entities/utils/ObjectId");
const _DbMappingUtils = require("./entities/utils/DbMappingUtils");
const _firestoreorganisationsfilterdto = require("./dto/firestore.organisations.filter.dto");
const _firestoreorganisationdto = require("./dto/firestore.organisation.dto");
const _firestoreOrganisationConfigservice = require("./services/firestoreOrganisationConfig.service");
const _firebasequerydto = require("./dto/firebase.query.dto");
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
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let FirestoreController = class FirestoreController {
    async allowedOrgs(req) {
        const token = req.headers['authorization']?.split(' ')[1];
        return await this.firestoreService.verifyTokenAndOrganisations(token);
    }
    postFarmInspectionResult(org, body) {
        // this.logger.log(body?.farm);
        // TODO: WIP
        return this.farmInspectionService.process(body, org);
    }
    async isAdmin(req) {
        const token = req.headers['authorization']?.split(' ')[1];
        return await this.firestoreService.isAdminAndVerifyToken(token);
    }
    async users(req, org, queryFilters) {
        const { userDetails, isAdmin } = await this.firebaseAuthService.fetchUserDetailsAndIsAdmin(req);
        if (!isAdmin) {
            throw new _common.HttpException('Unauthorized', _common.HttpStatus.UNAUTHORIZED);
        }
        const currentUser = {
            id: userDetails.uid,
            refcollection: _DbMappingUtils.collectionKeys.platformusers
        };
        const ops = {
            configKey: 'ltc',
            currentUser,
            tx: null,
            fetchTotal: true
        };
        const filters = [];
        const ordering = [];
        if (queryFilters.sort) {
            ordering.push({
                key: queryFilters.sort,
                direction: queryFilters.sortOrder ?? 'desc'
            });
        }
        if (queryFilters.email) {
            filters.push({
                key: 'email',
                value: queryFilters.email,
                operation: '=='
            });
        }
        if (org) {
            filters.push({
                key: 'organisations',
                value: {
                    id: org,
                    refcollection: _DbMappingUtils.collectionKeys.organisations,
                    isPreviousVersion: false
                },
                operation: 'array-contains'
            });
        }
        const data = await this.firestoreOrmService.searchBy(_Accounts.default, {
            filters,
            ordering,
            ops,
            limit: queryFilters.limit ? parseInt(queryFilters.limit) : undefined,
            offset: queryFilters.page ? parseInt(queryFilters.page) : undefined
        });
        const users = data.values.map((user)=>({
                ...user,
                role: user.workspaceRole && Object.entries(user.workspaceRole).length > 0 ? Object.entries(user.workspaceRole).filter(([workspace, role])=>workspace.startsWith(org + '_'))?.map(([workspace, role])=>role.replace(/ALL/i, ''))[0] : ''
            }));
        return {
            data: users,
            count: data.totalCount ?? data.values.length
        };
    }
    async createUser(req, res, organisation, body) {
        try {
            const { userDetails, isAdmin } = await this.firebaseAuthService.fetchUserDetailsAndIsAdmin(req);
            if (!isAdmin) {
                throw new _common.HttpException('Unauthorized', _common.HttpStatus.UNAUTHORIZED);
            }
            if (!userDetails) {
                return res.status(401).json({
                    message: 'Invalid token'
                });
            }
            const email = body.email;
            const role = body.role.toLocaleLowerCase() === 'admin' ? body.role.toLocaleLowerCase() : body.role + 'ALL';
            const name = body.name;
            let firebaseUser = await this.firebaseAuthService.getUserByEmail(email);
            const logPrefix = `::CREATEUSER::${email}:${name}:${role}`;
            let baseUser;
            if (!firebaseUser) {
                console.log(`Firebase user doesn't exist, create one ${logPrefix}`);
                firebaseUser = await this.firebaseAuthService.signup({
                    email,
                    password: body.password,
                    displayName: name
                });
            } else {
                return res.status(_common.HttpStatus.FORBIDDEN).json({
                    message: 'User already register'
                });
            }
            const workspaceNameMaster = (0, _utils.constructDefaultWorkspaceNameMaster)(organisation);
            const workspaceNameTest = (0, _utils.constructDefaultWorkspaceNameTest)(organisation);
            baseUser = await this.firestoreOrmService.findBy('email', email, _Accounts.default);
            const tx = this.firestoreOrmService.getTransaction();
            const currentUser = new _ObjectId.ObjectId(userDetails.uid, _DbMappingUtils.collectionKeys.platformusers);
            const dbOps = {
                tx,
                configKey: 'ltc',
                currentUser
            };
            if (!baseUser) {
                console.log(`Our user dont exist, create one ${logPrefix}`);
                baseUser = await this.firestoreUserService.createAccount(firebaseUser.uid, email, dbOps);
                baseUser.name = body.name;
                baseUser.uid = firebaseUser.uid;
                baseUser = await this.firestoreOrmService.update(baseUser, dbOps);
            }
            const ws_master = await this.firestoreOrmService.getBy({
                id: workspaceNameMaster,
                refcollection: _DbMappingUtils.collectionKeys.workspaces
            }, _Workspace.default, dbOps);
            const ws_test = await this.firestoreOrmService.getBy({
                id: workspaceNameTest,
                refcollection: _DbMappingUtils.collectionKeys.workspaces
            }, _Workspace.default, dbOps);
            if (role) {
                baseUser.setWorkspaceRole(ws_master.id, role);
                baseUser.setWorkspaceRole(ws_test.id, role);
                baseUser = await this.firestoreOrmService.update(baseUser, dbOps);
            }
            await this.firestoreOrganisationService.addOrganisationUser(ws_master.organisation, baseUser.id, dbOps, baseUser);
            await this.firestoreWorkspaceService.addWorkspaceUser(ws_master.id, baseUser.id, dbOps, undefined, false, baseUser);
            await this.firestoreWorkspaceService.addWorkspaceUser(ws_test.id, baseUser.id, dbOps, undefined, false, baseUser);
            await this.firestoreOrmService.commit(tx);
            return res.status(_common.HttpStatus.CREATED).json({
                message: 'User created successfully',
                user: baseUser
            });
        } catch (error) {
            return res.status(_common.HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: error?.message,
                error
            });
        }
    }
    async updateUser(req, res, id, organisation, body) {
        try {
            const { userDetails, isAdmin } = await this.firebaseAuthService.fetchUserDetailsAndIsAdmin(req);
            if (!isAdmin) {
                throw new _common.HttpException('Unauthorized', _common.HttpStatus.UNAUTHORIZED);
            }
            if (!userDetails) {
                return res.status(401).json({
                    message: 'Invalid token'
                });
            }
            const currentUser = new _ObjectId.ObjectId(userDetails.uid, _DbMappingUtils.collectionKeys.platformusers);
            const tx = this.firestoreOrmService.getTransaction();
            const dbOps = {
                configKey: 'ltc',
                currentUser,
                tx
            };
            const workspaceNameMaster = (0, _utils.constructDefaultWorkspaceNameMaster)(organisation);
            const workspaceNameTest = (0, _utils.constructDefaultWorkspaceNameTest)(organisation);
            const ws_master = await this.firestoreOrmService.getBy({
                id: workspaceNameMaster,
                refcollection: _DbMappingUtils.collectionKeys.workspaces
            }, _Workspace.default, dbOps);
            const ws_test = await this.firestoreOrmService.getBy({
                id: workspaceNameTest,
                refcollection: _DbMappingUtils.collectionKeys.workspaces
            }, _Workspace.default, dbOps);
            const role = body?.role ? body.role.toLocaleLowerCase() === 'admin' ? body.role.toLocaleLowerCase() : body.role + 'ALL' : null;
            if (id && id !== '') {
                const baseUser = await this.firestoreOrmService.getById(id, _Accounts.default);
                baseUser.name = body.name ?? baseUser.name;
                baseUser.email = body.email ?? baseUser.email;
                if (role) {
                    baseUser.setWorkspaceRole(ws_master.id, role);
                    baseUser.setWorkspaceRole(ws_test.id, role);
                }
                const resp = await this.firestoreUserService.updateUser(baseUser, dbOps);
                res.status(_common.HttpStatus.OK).json({
                    message: 'User updated successfully',
                    data: resp
                });
            } else if (body.ids && role) {
                for (const id of body.ids){
                    const baseUser = await this.firestoreOrmService.getById(id, _Accounts.default);
                    if (role) {
                        baseUser.setWorkspaceRole(ws_master.id, role);
                        baseUser.setWorkspaceRole(ws_test.id, role);
                    }
                    const resp = await this.firestoreUserService.updateUser(baseUser, dbOps);
                }
                res.status(_common.HttpStatus.OK).json({
                    message: 'User updated successfully',
                    data: null
                });
            }
            await this.firestoreOrmService.commit(tx);
        } catch (error) {
            return res.status(_common.HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: error?.message,
                error
            });
        }
    }
    async removeUserFully(res, id, organisation, body) {
        try {
            const dbOps = {
                tx: undefined,
                configKey: undefined,
                currentUser: undefined
            };
            if (body.ids && body.ids.length > 0) {
                for (const id of body.ids){
                    const tx = this.firestoreOrmService.getTransaction();
                    dbOps.tx = tx;
                    const resp = await this.firestoreUserService.removeUser(id, dbOps);
                    await this.firestoreOrmService.commit(tx);
                }
                return res.status(_common.HttpStatus.OK).json({
                    message: 'Users removed successfully',
                    data: null
                });
            } else if (id) {
                const tx = this.firestoreOrmService.getTransaction();
                dbOps.tx = tx;
                const resp = await this.firestoreUserService.removeUser(id, dbOps);
                await this.firestoreOrmService.commit(tx);
                return res.status(_common.HttpStatus.OK).json({
                    message: 'User removed successfully',
                    data: resp
                });
            } else {
                return res.status(_common.HttpStatus.BAD_REQUEST).json({
                    message: 'No user ID(s) provided'
                });
            }
        } catch (e) {
            console.log('CreateUser.ERROR', e);
            res.status(500).send(e.message || 'failed.');
        }
    }
    async organizations(queryFilters) {
        const ops = {
            configKey: undefined,
            currentUser: undefined,
            fetchTotal: true
        };
        const filters = [];
        const ordering = [];
        if (queryFilters.sort) {
            ordering.push({
                key: queryFilters.sort,
                direction: queryFilters.sortOrder ?? 'desc'
            });
        }
        if (queryFilters.name) {
            filters.push({
                key: 'name',
                value: queryFilters.name,
                operation: '=='
            });
        }
        const data = await this.firestoreOrmService.searchBy(_Organisation.default, {
            filters,
            ordering,
            ops,
            limit: queryFilters.limit ? parseInt(queryFilters.limit) : undefined,
            offset: queryFilters.page ? parseInt(queryFilters.page) : undefined
        });
        return {
            data: data.values,
            count: data.totalCount ?? data.values.length
        };
    }
    async createOrganization(req, res, body) {
        try {
            const { userDetails, isAdmin } = await this.firebaseAuthService.fetchUserDetailsAndIsAdmin(req);
            if (!isAdmin) {
                throw new _common.HttpException('Unauthorized', _common.HttpStatus.UNAUTHORIZED);
            }
            if (!userDetails) {
                return res.status(401).json({
                    message: 'Invalid token'
                });
            }
            const currentUser = {
                id: userDetails.uid,
                refcollection: _DbMappingUtils.collectionKeys.platformusers
            };
            const dbOps = {
                configKey: 'ltc',
                currentUser,
                tx: null
            };
            const data = await this.firestoreOrganisationService.createOrganisation(body.name, body.name, dbOps);
            await this.firestoreOrganisationService.addOrganisationUser(data.id, new _ObjectId.ObjectId(userDetails.uid, _DbMappingUtils.collectionKeys.platformusers), dbOps);
            const workspaceNameMaster = (0, _utils.constructDefaultWorkspaceNameMaster)(data.id.id);
            const workspaceNameTest = (0, _utils.constructDefaultWorkspaceNameTest)(data.id.id);
            try {
                dbOps.tx = this.firestoreOrmService.getTransaction();
                await this.firestoreWorkspaceService.createWorkspace('test', 'ltc', data.id, workspaceNameTest, dbOps);
                this.firestoreOrmService.commit(dbOps.tx);
            } catch (err) {
                console.log(err);
                throw new _common.HttpException("Workspace couldn't be created", _common.HttpStatus.BAD_REQUEST);
            }
            try {
                dbOps.tx = this.firestoreOrmService.getTransaction();
                await this.firestoreWorkspaceService.createWorkspace('master', 'ltc', data.id, workspaceNameMaster, dbOps);
                this.firestoreOrmService.commit(dbOps.tx);
            } catch (err) {
                console.log(err);
                throw new _common.HttpException("Workspace couldn't be created", _common.HttpStatus.BAD_REQUEST);
            }
            const organisation = await this.firestoreOrmService.getBy(data.id, _Organisation.default, dbOps);
            return res.status(_common.HttpStatus.CREATED).json({
                message: 'Organisation created successfully',
                data: organisation
            });
        } catch (error) {
            return res.status(_common.HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: error?.message,
                error
            });
        }
    }
    async updateOrganization(req, res, id, body) {
        try {
            const { userDetails, isAdmin } = await this.firebaseAuthService.fetchUserDetailsAndIsAdmin(req);
            if (!isAdmin) {
                throw new _common.HttpException('Unauthorized', _common.HttpStatus.UNAUTHORIZED);
            }
            if (!userDetails) {
                return res.status(401).json({
                    message: 'Invalid token'
                });
            }
            const currentUser = {
                id: userDetails.uid,
                refcollection: _DbMappingUtils.collectionKeys.platformusers
            };
            const tx = this.firestoreOrmService.getTransaction();
            const dbOps = {
                configKey: 'ltc',
                currentUser,
                tx
            };
            const resp = {
                message: 'Organisation updated successfully',
                data: null
            };
            const payload = {
                id: new _ObjectId.ObjectId(id, _DbMappingUtils.collectionKeys.organisations)
            };
            if (body.name) {
                payload.name = body.name;
                resp.data = await this.firestoreOrganisationService.updateOrganisation(payload, dbOps);
            }
            if (body.userId) {
                resp.data = await this.firestoreOrganisationService.addOrganisationUser(payload.id, new _ObjectId.ObjectId(body.userId, _DbMappingUtils.collectionKeys.platformusers), {
                    ...dbOps,
                    tx: undefined
                });
                const workspaceNameMaster = (0, _utils.constructDefaultWorkspaceNameMaster)(id);
                const workspaceNameTest = (0, _utils.constructDefaultWorkspaceNameTest)(id);
                await this.firestoreWorkspaceService.addWorkspaceUser(new _ObjectId.ObjectId(workspaceNameTest, _DbMappingUtils.collectionKeys.workspaces), new _ObjectId.ObjectId(body.userId, _DbMappingUtils.collectionKeys.platformusers), {
                    ...dbOps,
                    tx: undefined
                }, undefined, false, undefined);
                await this.firestoreWorkspaceService.addWorkspaceUser(new _ObjectId.ObjectId(workspaceNameMaster, _DbMappingUtils.collectionKeys.workspaces), new _ObjectId.ObjectId(body.userId, _DbMappingUtils.collectionKeys.platformusers), {
                    ...dbOps,
                    tx: undefined
                }, undefined, false, undefined);
                if (!resp.data) {
                    resp.message = 'User not added into organisation';
                } else {
                    resp.message = 'User added into organisation successfully';
                }
            }
            if (body.isToAddWorkspaces) {
                const workspaceNameMaster = (0, _utils.constructDefaultWorkspaceNameMaster)(id);
                const workspaceNameTest = (0, _utils.constructDefaultWorkspaceNameTest)(id);
                const [wsMaster, wsTest] = await Promise.all([
                    this.firestoreWorkspaceService.getWorkspaceById(workspaceNameMaster, dbOps),
                    this.firestoreWorkspaceService.getWorkspaceById(workspaceNameTest, dbOps)
                ]);
                let organisation = await this.firestoreOrmService.getBy(payload.id, _Organisation.default, dbOps);
                dbOps.tx = this.firestoreOrmService.getTransaction();
                if (!wsMaster) {
                    await this.firestoreWorkspaceService.createWorkspace('master', 'ltc', payload.id, workspaceNameMaster, dbOps);
                } else {
                    if (!organisation.hasWorkspace(wsMaster.id)) {
                        organisation.addWorkspace(wsMaster.id);
                        organisation = await this.firestoreOrmService.update(organisation, dbOps);
                    }
                }
                this.firestoreOrmService.commit(dbOps.tx);
                dbOps.tx = this.firestoreOrmService.getTransaction();
                if (!wsTest) {
                    await this.firestoreWorkspaceService.createWorkspace('test', 'ltc', payload.id, workspaceNameTest, dbOps);
                } else {
                    if (!organisation.hasWorkspace(wsTest.id)) {
                        organisation.addWorkspace(wsTest.id);
                        organisation = await this.firestoreOrmService.update(organisation, dbOps);
                    }
                }
                this.firestoreOrmService.commit(dbOps.tx);
                resp.message = 'Workspaces added successfully';
            }
            await this.firestoreOrmService.commit(tx);
            res.status(_common.HttpStatus.OK).json(resp);
        } catch (error) {
            return res.status(_common.HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: error?.message,
                error
            });
        }
    }
    async resetPassword(res, email) {
        try {
            const respURL = await this.firebaseAuthService.sendPasswordResetEmail(email);
            if (respURL) {
                const payload = {
                    reset_url: respURL
                };
                await this.sendGridService.sendMail(email, 'Password Reset Request', null, null, payload);
                return res.status(_common.HttpStatus.OK).json({
                    message: 'Reset Password Link Sent',
                    url: respURL
                });
            }
        } catch (error) {
            return res.status(_common.HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: error?.message,
                error
            });
        }
    }
    async updateUsername(id, name) {
        const userRef = this.firestoreService.getDb().collection('platformusers').doc(id);
        await userRef.update({
            name
        });
        return {
            message: 'Username updated successfully'
        };
    }
    async deleteDocument(workspace, collection, id) {
        return await this.firestoreService.deleteDocument(workspace, collection, id);
    }
    async getPaginatedDocuments(filters) {
        return await this.firestoreService.getPaginatedDocuments(filters);
    }
    async getDocument(workspace, collection, id) {
        return await this.firestoreService.getDocument(workspace, collection, id);
    }
    async createDocument(workspace, collection, payload, id) {
        return await this.firestoreService.createDocument(workspace, collection, payload, id);
    }
    async updateDocument(workspace, collection, id, payload) {
        return await this.firestoreService.updateDocument(workspace, collection, id, payload);
    }
    async getWorkspacesAndCollections(organization) {
        return await this.firestoreService.getWorkspacesAndCollectionsForOrg(organization);
    }
    async getCollectionColumns(collection) {
        return this.firestoreService.getColumnsAndFiltersForCollection(collection);
    }
    async getOrganisationConfig(org, id) {
        try {
            const orgId = new _ObjectId.ObjectId(org, _DbMappingUtils.collectionKeys.organisation_config);
            return await this.firestoreOrganisationConfigService.getOrganisationConfig(orgId);
        } catch (error) {
            // Log the error
            console.error('Error fetching organisation config:', error);
            throw new _common.InternalServerErrorException('Failed to retrieve organisation config');
        }
    }
    async updateOrgConfigLocality(req, res, org, id, body) {
        try {
            const { userDetails, isAdmin } = await this.firebaseAuthService.fetchUserDetailsAndIsAdmin(req);
            if (!userDetails) {
                return res.status(_common.HttpStatus.UNAUTHORIZED).json({
                    message: 'Invalid token'
                });
            }
            if (!isAdmin) {
                return res.status(_common.HttpStatus.UNAUTHORIZED).json({
                    message: 'Unauthorized'
                });
            }
            const currentUser = {
                id: userDetails.uid,
                refcollection: _DbMappingUtils.collectionKeys.platformusers
            };
            const tx = this.firestoreOrmService.getTransaction();
            const dbOps = {
                configKey: 'ltc',
                currentUser,
                tx
            };
            const orgId = new _ObjectId.ObjectId(org, _DbMappingUtils.collectionKeys.organisation_config);
            // Update the config with locality
            const result = await this.firestoreOrganisationConfigService.updateOrganisationConfig(orgId, body, dbOps);
            await this.firestoreOrmService.commit(tx);
            return res.status(_common.HttpStatus.OK).json({
                message: 'Organisation config locality updated successfully',
                data: result
            });
        } catch (error) {
            console.error('Error updating organisation config:', error); // Log the error for debugging
            const status = error instanceof _common.NotFoundException ? _common.HttpStatus.NOT_FOUND : _common.HttpStatus.INTERNAL_SERVER_ERROR;
            return res.status(status).json({
                message: error.message || 'Failed to update organisation configuration'
            });
        }
    }
    async getAllWorkSpacesByOrganisationId(org) {
        return this.firestoreWorkspaceService.getAllWorkspaceByOrganisationId(org);
    }
    constructor(firestoreService, farmInspectionService, firebaseAuthService, sendGridService, firestoreOrganisationService, firestoreWorkspaceService, firestoreOrmService, firestoreUserService, firestoreOrganisationConfigService){
        this.firestoreService = firestoreService;
        this.farmInspectionService = farmInspectionService;
        this.firebaseAuthService = firebaseAuthService;
        this.sendGridService = sendGridService;
        this.firestoreOrganisationService = firestoreOrganisationService;
        this.firestoreWorkspaceService = firestoreWorkspaceService;
        this.firestoreOrmService = firestoreOrmService;
        this.firestoreUserService = firestoreUserService;
        this.firestoreOrganisationConfigService = firestoreOrganisationConfigService;
        this.logger = new _common.Logger(FirestoreController.name);
    }
};
_ts_decorate([
    (0, _common.Get)('myAllowedOrgs'),
    _ts_param(0, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Request === "undefined" ? Object : _express.Request
    ]),
    _ts_metadata("design:returntype", Promise)
], FirestoreController.prototype, "allowedOrgs", null);
_ts_decorate([
    (0, _common.Post)(_constants.FARM_INSPECTION_URL),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _firestorefarmInspectiondto.FirestoreFarmInspectionDto === "undefined" ? Object : _firestorefarmInspectiondto.FirestoreFarmInspectionDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], FirestoreController.prototype, "postFarmInspectionResult", null);
_ts_decorate([
    (0, _common.Get)('isAdmin'),
    _ts_param(0, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Request === "undefined" ? Object : _express.Request
    ]),
    _ts_metadata("design:returntype", Promise)
], FirestoreController.prototype, "isAdmin", null);
_ts_decorate([
    (0, _common.Get)(':org?/users'),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Param)('org')),
    _ts_param(2, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Request === "undefined" ? Object : _express.Request,
        String,
        typeof _firestoreusersfilterdto.FirestoreUsersFilter === "undefined" ? Object : _firestoreusersfilterdto.FirestoreUsersFilter
    ]),
    _ts_metadata("design:returntype", Promise)
], FirestoreController.prototype, "users", null);
_ts_decorate([
    (0, _common.Post)(':org/users'),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Res)()),
    _ts_param(2, (0, _common.Param)('org')),
    _ts_param(3, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Request === "undefined" ? Object : _express.Request,
        typeof _express.Response === "undefined" ? Object : _express.Response,
        String,
        typeof _firestoreuserdto.FireStoreCreateUserDto === "undefined" ? Object : _firestoreuserdto.FireStoreCreateUserDto
    ]),
    _ts_metadata("design:returntype", Promise)
], FirestoreController.prototype, "createUser", null);
_ts_decorate([
    (0, _common.Patch)(':org/users/:id?'),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Res)()),
    _ts_param(2, (0, _common.Param)('id')),
    _ts_param(3, (0, _common.Param)('org')),
    _ts_param(4, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Request === "undefined" ? Object : _express.Request,
        typeof _express.Response === "undefined" ? Object : _express.Response,
        String,
        String,
        typeof _firestoreuserdto.FireStoreUpdateUserDto === "undefined" ? Object : _firestoreuserdto.FireStoreUpdateUserDto
    ]),
    _ts_metadata("design:returntype", Promise)
], FirestoreController.prototype, "updateUser", null);
_ts_decorate([
    (0, _common.Delete)(':org/users/:id?'),
    _ts_param(0, (0, _common.Res)()),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_param(2, (0, _common.Param)('org')),
    _ts_param(3, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Response === "undefined" ? Object : _express.Response,
        String,
        String,
        typeof _firestoreuserdto.FireStoreDeleteUsersDto === "undefined" ? Object : _firestoreuserdto.FireStoreDeleteUsersDto
    ]),
    _ts_metadata("design:returntype", Promise)
], FirestoreController.prototype, "removeUserFully", null);
_ts_decorate([
    (0, _common.Get)('organisations'),
    _ts_param(0, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _firestoreorganisationsfilterdto.FirestoreOrganisationFilter === "undefined" ? Object : _firestoreorganisationsfilterdto.FirestoreOrganisationFilter
    ]),
    _ts_metadata("design:returntype", Promise)
], FirestoreController.prototype, "organizations", null);
_ts_decorate([
    (0, _common.Post)('organisations'),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Res)()),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Request === "undefined" ? Object : _express.Request,
        typeof _express.Response === "undefined" ? Object : _express.Response,
        typeof _Organisation.default === "undefined" ? Object : _Organisation.default
    ]),
    _ts_metadata("design:returntype", Promise)
], FirestoreController.prototype, "createOrganization", null);
_ts_decorate([
    (0, _common.Patch)('organisations/:id'),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Res)()),
    _ts_param(2, (0, _common.Param)('id')),
    _ts_param(3, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Request === "undefined" ? Object : _express.Request,
        typeof _express.Response === "undefined" ? Object : _express.Response,
        String,
        typeof _firestoreorganisationdto.FireStoreCreateUpdateOrganisationDto === "undefined" ? Object : _firestoreorganisationdto.FireStoreCreateUpdateOrganisationDto
    ]),
    _ts_metadata("design:returntype", Promise)
], FirestoreController.prototype, "updateOrganization", null);
_ts_decorate([
    (0, _common.Post)('reset-password'),
    _ts_param(0, (0, _common.Res)()),
    _ts_param(1, (0, _common.Body)('email')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Response === "undefined" ? Object : _express.Response,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], FirestoreController.prototype, "resetPassword", null);
_ts_decorate([
    (0, _common.Put)('username/:id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)('username')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], FirestoreController.prototype, "updateUsername", null);
_ts_decorate([
    (0, _common.Delete)('firebase/:workspace/:collection/:id'),
    _ts_param(0, (0, _common.Param)('workspace')),
    _ts_param(1, (0, _common.Param)('collection')),
    _ts_param(2, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], FirestoreController.prototype, "deleteDocument", null);
_ts_decorate([
    (0, _common.Get)('firebase/documents'),
    _ts_param(0, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _firebasequerydto.FieldTaskQuery === "undefined" ? Object : _firebasequerydto.FieldTaskQuery
    ]),
    _ts_metadata("design:returntype", Promise)
], FirestoreController.prototype, "getPaginatedDocuments", null);
_ts_decorate([
    (0, _common.Get)('firebase/:workspace/:collection/:id'),
    _ts_param(0, (0, _common.Param)('workspace')),
    _ts_param(1, (0, _common.Param)('collection')),
    _ts_param(2, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], FirestoreController.prototype, "getDocument", null);
_ts_decorate([
    (0, _common.Post)('firebase/:workspace/:collection'),
    _ts_param(0, (0, _common.Param)('workspace')),
    _ts_param(1, (0, _common.Param)('collection')),
    _ts_param(2, (0, _common.Body)()),
    _ts_param(3, (0, _common.Query)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        Object,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], FirestoreController.prototype, "createDocument", null);
_ts_decorate([
    (0, _common.Put)('firebase/:workspace/:collection/:id'),
    _ts_param(0, (0, _common.Param)('workspace')),
    _ts_param(1, (0, _common.Param)('collection')),
    _ts_param(2, (0, _common.Param)('id')),
    _ts_param(3, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        String,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], FirestoreController.prototype, "updateDocument", null);
_ts_decorate([
    (0, _common.Get)(':org/firebase/workspaces'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], FirestoreController.prototype, "getWorkspacesAndCollections", null);
_ts_decorate([
    (0, _common.Get)(':collection/firebase/collection-columns'),
    _ts_param(0, (0, _common.Param)('collection')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], FirestoreController.prototype, "getCollectionColumns", null);
_ts_decorate([
    (0, _common.Get)(':org/organisation-config/:id?'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], FirestoreController.prototype, "getOrganisationConfig", null);
_ts_decorate([
    (0, _common.Patch)(':org/organisation-config/:id'),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Res)()),
    _ts_param(2, (0, _common.Param)('org')),
    _ts_param(3, (0, _common.Param)('id')),
    _ts_param(4, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Request === "undefined" ? Object : _express.Request,
        typeof _express.Response === "undefined" ? Object : _express.Response,
        String,
        String,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], FirestoreController.prototype, "updateOrgConfigLocality", null);
_ts_decorate([
    (0, _common.Get)(':org/workspaces'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], FirestoreController.prototype, "getAllWorkSpacesByOrganisationId", null);
FirestoreController = _ts_decorate([
    (0, _common.Controller)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _firestoreservice.FirestoreService === "undefined" ? Object : _firestoreservice.FirestoreService,
        typeof _firestorefarminspectionservice.FirestoreFarmInspectionService === "undefined" ? Object : _firestorefarminspectionservice.FirestoreFarmInspectionService,
        typeof _firebaseAuthservice.FirebaseAuthService === "undefined" ? Object : _firebaseAuthservice.FirebaseAuthService,
        typeof _sendgridservice.SendGridService === "undefined" ? Object : _sendgridservice.SendGridService,
        typeof _firestoreOrgnisationservice.FirestoreOrgnisationService === "undefined" ? Object : _firestoreOrgnisationservice.FirestoreOrgnisationService,
        typeof _firestoreWorkspaceservice.FirestoreWorkspaceService === "undefined" ? Object : _firestoreWorkspaceservice.FirestoreWorkspaceService,
        typeof _firestoreOrmservice.FirestoreOrmService === "undefined" ? Object : _firestoreOrmservice.FirestoreOrmService,
        typeof _firestoreUserservice.FirestoreUserService === "undefined" ? Object : _firestoreUserservice.FirestoreUserService,
        typeof _firestoreOrganisationConfigservice.FirestoreOrganisationConfig === "undefined" ? Object : _firestoreOrganisationConfigservice.FirestoreOrganisationConfig
    ])
], FirestoreController);
