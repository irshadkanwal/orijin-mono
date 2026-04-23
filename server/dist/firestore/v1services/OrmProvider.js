"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return OrmProvider;
    }
});
const _FirestoreDBProvider = require("./FirestoreDBProvider");
const _utils = require("../v1utils/utils");
const _uuid = require("uuid");
const _ObjectId = require("../v1entities/utis/ObjectId");
const _mappingUtils = require("../v1utils/mappingUtils");
const _ormUtils = require("../v1utils/ormUtils");
const _dbMappingUtils = require("../v1utils/dbMappingUtils");
const _common = require("@nestjs/common");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let OrmProvider = class OrmProvider {
    async setCreatedFields(object, ops) {
        object.createdBy = ops.currentUser;
        object.createdDate = this.getCurrentDate();
    }
    async setUpdatedFields(object, ops) {
        object.updatedBy = ops.currentUser;
        object.updatedDate = this.getCurrentDate();
    }
    getCurrentDate() {
        return new Date();
    }
    async getBy(id, cls, ops) {
        return this.getObjectByReferenceFromDb(id, ops);
    }
    sliceIntoChunks(arr, chunkSize) {
        const res = [];
        for(let i = 0; i < arr.length; i += chunkSize){
            const chunk = arr.slice(i, i + chunkSize);
            res.push(chunk);
        }
        return res;
    }
    // private parseAcRules(collection: string): IFilter[] {
    //   const platformUser: AccountV1 = this.getCurrentUserAccount();
    //
    //   if (!platformUser) {
    //     throw Error('platformUser has to be available');
    //   }
    //
    //   const rules: ACRule[] =
    //     this._configProvider.originalConfig.settings?.authSettings?.rolesOther ??
    //     [];
    //
    //   const myRoles: ACRule[] = this.getCurrentRulesRoles();
    //
    //   const result = [];
    //
    //   const tags = myRoles.map((r) => r.tag);
    //   if ((tags || []).length == 0) {
    //     throw Error('no tags found for user');
    //   }
    //   if ((tags || []).includes('ALL')) {
    //     return [];
    //   }
    //   const string = tags[0];
    //   if (!string) {
    //     throw Error('no tags found for user');
    //   }
    //   result.push({ key: 'id.authTag', operation: 'in', value: [string] });
    //
    //   // result.push({ key: "id.authTag", operation: "==", value: value });
    //
    //   return result;
    // }
    async replaceOneFilterValue(changedFilters, filter, key, initializationScope = {}) {
        let noFetch = false;
        const value = filter[key];
        // console.log('callApiDb ',value);
        if (value && String(value).includes('#')) {
            if (Object.entries(initializationScope).length === 0 && initializationScope.constructor === Object) {
                // console.log('callApiDb.nofetch');
                noFetch = true;
            }
            const newValue = null;
            if (value.startsWith('#JSONATA#')) {
                const exp = value.replace('#JSONATA#', '');
                // console.log('callApiDb..OPTIONS.JSONATA.initializationScope:' + exp, initializationScope );
                // newValue = this._jsonServices.execJsonata(initializationScope, exp);
                // console.log('callApiDb.OPTIONS.JSONATA.initializationScope.value ' , newValue );
                throw Error('not supported, if needed copy from V1');
            } else {
                const exp1 = value.replace('#', '');
                // console.log('callApiDb..evaluateJmesPath.initializationScope:' + exp1 , initializationScope );
                // newValue = await this._jsonServices.execJmesPath(
                //   initializationScope,
                //   exp1,
                // );
                throw Error('not supported, if needed copy from V1');
            // console.log('callApiDb..evaluateJmesPath.initializationScope ', newValue );
            }
            if (String(newValue).includes('#')) {
                console.log('REplace didnt work ' + value, initializationScope);
            }
            if (newValue == null) {
                console.log('Replace for the filter value is empty ' + value, initializationScope);
                throw Error('FILTERVALUEEMPTY');
            }
            changedFilters[filter.key] = {
                oldValue: value,
                newValue
            };
            // console.log("callApiDb.changedFilters", changedFilters, initializationScope);
            // console.log("callApiDb.filterDb", filter);
            const newVar = {
                ...filter,
                [key]: newValue
            };
            // console.log("callApiDb.filterDb", newVar);
            return newVar;
        }
        return filter;
    }
    // private applyAuthRoleForOneEntity(
    //   entity: AbstractEntity,
    //   myRoles: string[],
    // ): boolean {
    //   const me = this._userAuthState.currentUser;
    //
    //   if (myRoles && myRoles.length > 0) {
    //     const entityRolesNeeded = entity.id.authRoles;
    //
    //     // console.log(`applyAuthRoleForOneEntity: ${entity.id.label} ${entity.createdBy.email}`,myRoles, entityRolesNeeded, me.email);
    //
    //     if (entityRolesNeeded && entityRolesNeeded.length > 0) {
    //       const firstRes = entityRolesNeeded.some((r) => myRoles.includes(r));
    //       if (firstRes) {
    //         return true;
    //       }
    //       if (entityRolesNeeded.indexOf('OWN') >= 0) {
    //         const b = entity.createdBy.labelShort === me.email;
    //         if (b) {
    //           return true;
    //         }
    //       }
    //       if (entityRolesNeeded.indexOf('OWN_AS_OPERATOR') >= 0) {
    //         const b = entity?.operatedBy?.id === me.id.id;
    //         if (b) {
    //           return true;
    //         }
    //         return false;
    //       }
    //     } else {
    //       return true;
    //     }
    //   } else {
    //     return false;
    //   }
    // }
    //
    // private getCurrentRulesRoles(): ACRule[] {
    //   const currentUser = this.getCurrentUserAccount();
    //   const myRoles =
    //     this._configProvider.originalConfig.settings?.authSettings?.rolesOther.filter(
    //       (r) =>
    //         r.name ===
    //         currentUser.workspaceRole[this._configProvider.currentWorkSpace.id],
    //     );
    //   return myRoles;
    // }
    // private getCurrentRulesRoleNames(): string[] {
    //   const myRoles = (this.getCurrentRulesRoles() || []).map((r) => r.role);
    //   return myRoles;
    // }
    //
    // private applyRolesForResult(
    //   results: PagedResult,
    //   ops?: OrmOptions,
    // ): PagedResult {
    //   if (ops && ops?.applyAC && !this._userAuthState.su) {
    //     const myRoles = this.getCurrentRulesRoleNames();
    //     const values = results.values.filter((e) =>
    //       this.applyAuthRoleForOneEntity(e, myRoles),
    //     );
    //     results.values = values;
    //   }
    //
    //   return results;
    // }
    getSearchTimerKey(collection, options) {
        if (options && options.filters && options.filters.length > 0) {
            if (options.filters.length > 1) {
                return `filterfromdb: ${options.filters[0].key}=${options.filters[0].value} : ${options.filters[1].key}=${options.filters[1].value}`;
            } else {
                return `filterfromdb: ${options.filters[0].key}=${options.filters[0].value}`;
            }
        }
        return `filterfromdb: ${collection}`;
    }
    //  search = async (collection: string, options?: SearchDbOptions): Promise<PagedResult> => {
    async executeSearch(collection, options) {
        let fullCollection = this.getFullCollection(collection, options.ops);
        if (options.ops?.isOfflineFirstDbOperations) {
            fullCollection = (0, _utils.fixUpTheRefCollectionForCollectionString)(fullCollection);
        }
        let result = null;
        if (!result) {
            result = await this._dbProvider.filter(fullCollection, options);
        // if(options.ops?.doCache){
        //   this.cache.set(key, result)
        // }
        }
        console.log('FS executeSearch result ' + collection, result.values, options.filters);
        const timerEnd = this.getSearchTimerKey(collection, options);
        const collectionObjects = result.values;
        if (collectionObjects && collectionObjects.length > 0) {
            if (options?.ops?.noObjectHydration) {
                result.values = collectionObjects;
            } else {
                const ops = options ? options.ops : null;
                const oObjects = await (0, _ormUtils.mapManyFromPlainAndExpand)(collectionObjects, collection, this.getObjectByReferenceFromDb, ops);
                result.values = oObjects;
            }
        }
        return result;
    }
    async findOneBy(property, propertyvalue, cls, ops) {
        return this.findObjectsByProperty((0, _mappingUtils.getCollectionKeyByClass)(cls), property, propertyvalue, true, ops);
    }
    async findSingle(collection, property, propertyvalue, ops) {
        return this.findObjectsByProperty(collection, property, propertyvalue, true, ops);
    }
    async findBy(property, propertyvalue, cls, ops) {
        return this.findObjectsByProperty((0, _mappingUtils.getCollectionKeyByClass)(cls), property, propertyvalue, true, ops);
    }
    async findAll(collection, property, propertyvalue, ops) {
        return this.findObjectsByProperty(collection, property, propertyvalue, false, ops);
    }
    async findAllBy(property, propertyvalue, cls, ops) {
        return this.findObjectsByProperty((0, _mappingUtils.getCollectionKeyByClass)(cls), property, propertyvalue, false, ops);
    }
    async getById(id, cls, ops) {
        let collectionKeyByClass = (0, _mappingUtils.getCollectionKeyByClass)(cls);
        if (ops?.isOfflineFirstDbOperations) {
            collectionKeyByClass = (0, _utils.fixUpTheRefCollectionForCollectionString)(collectionKeyByClass);
        }
        const objectId = new _ObjectId.ObjectId(id, collectionKeyByClass);
        return this.getObjectByReferenceFromDb(objectId, ops);
    }
    getFullCollection(path, ops, delimeter = '.', ws = ops?.workspace) {
        if ((0, _dbMappingUtils.isGlobalCollection)(path)) {
            return path;
        } else {
            if (!ops?.workspace) {
                throw Error('workspace has to be provide in the ops when finding collection ' + path);
            }
            if (!ws) {
                ws = ops?.workspace;
            }
            if (!ws) {
                console.log('ops', ops);
                throw Error("ws can't be null");
            }
            return _dbMappingUtils.WORKSPACES_PARENT_COLLECTION + delimeter + ws + delimeter + path;
        }
    }
    wrapDataWithOrgDetails(data, ops) {
        const workspaceData = data;
        workspaceData.meta_workspace = ops.workspace;
        workspaceData.meta_organisation = ops.organisation;
        workspaceData.meta_configkey = ops.configKey;
        return workspaceData;
    }
    // applyAcForEntityByRolesAndConditions(
    //   a: {
    //     name?: string;
    //     rowCondition?: string;
    //     roles?: string[];
    //     rowConditionsForRoles?: RowConditionForRole[];
    //   },
    //   item: AbstractEntity,
    // ): boolean {
    //   let allow = true;
    //
    //   // let currentPlatformUser = this.getCurrentUserAccount()
    //
    //   // const myRoles = this.getCurrentRulesRoleNames();
    //
    //   if (a.rowConditionsForRoles && a.rowConditionsForRoles.length > 0) {
    //     // let originalConfig = this._configProvider.originalConfig;
    //
    //     // let currentUserRoles =
    //     //   currentPlatformUser.accessControlRoles[0];
    //
    //     // if (currentPlatformUser.workspaceRole) {
    //     //   const workspaceRole =
    //     //     currentPlatformUser.workspaceRole[this._configProvider.currentWorkSpace.id];
    //     //   if (workspaceRole) {
    //     //     return r.name === workspaceRole;
    //     //   }
    //     // }
    //
    //     // let myRoles = originalConfig.settings.authSettings.rolesOther
    //     //   .filter((r) => r.name === currentUserRoles)
    //     //   .map((r) => r.role);
    //
    //     // console.log('myRoles', myRoles);
    //
    //     const applicableCOnditions = a.rowConditionsForRoles.filter((r) =>
    //       r.roles.includes(myRoles[0]),
    //     );
    //
    //     if (
    //       applicableCOnditions.length === 0 ||
    //       applicableCOnditions.length > 1
    //     ) {
    //       console.log(
    //         'Disallowed by rowConditionsForRoles',
    //         a.rowConditionsForRoles,
    //         applicableCOnditions,
    //       );
    //       console.log('applicableCOnditions', applicableCOnditions);
    //       allow = false;
    //     } else {
    //       allow = this._jsonServices.execJsonata(
    //         { entity: item },
    //         applicableCOnditions[0].rowCondition,
    //       );
    //     }
    //
    //     if (!allow) {
    //     }
    //   } else {
    //     if (a.roles && a.roles.length > 0) {
    //       const originalConfig = this._configProvider.originalConfig;
    //
    //       // let currentUserRoles =
    //       //   currentPlatformUser.accessControlRoles[0];
    //       //
    //       // let myRoles = originalConfig.settings.authSettings.rolesOther
    //       //   .filter((r) => r.name === currentUserRoles)
    //       //   .map((r) => r.role);
    //       allow = myRoles.some((r) => a.roles.includes(r));
    //       if (!allow) {
    //       }
    //     }
    //
    //     if (allow) {
    //       allow = a.rowCondition
    //         ? this._jsonServices.execJsonata({ entity: item }, a.rowCondition)
    //         : true;
    //       if (!allow) {
    //         console.log('Disallowed by rowCondition', a.rowCondition);
    //       }
    //     }
    //   }
    //   return allow;
    // }
    async onlyCreate(entity, ops) {
        const tx = !!ops && !!ops.tx ? ops.tx.transaction : null;
        (0, _utils.setUpdatedFields)(entity, ops);
        const id = entity.id.id;
        if (!id) {
            const id = entity.properties ? entity.properties['customId'] : null;
            if (!id) {
                throw Error('It has to be provided');
            }
            if (!entity.id) {
                entity.setId(id);
            }
            (0, _utils.setCreatedFields)(entity, ops);
        // await this.setAuthTagWhenNeeded(entity, ops);
        }
        if (!entity.meta_workspace) {
            throw Error('meta_workspace');
        }
        if (!entity.meta_organisation) {
            throw Error('meta_organisation');
        }
        if (!entity.meta_configkey) {
            throw Error('meta_configkey');
        }
        // let entityValues = null;
        // if (!!ops && !!ops.expandChildren) {
        //   entityValues = await this.processChildrenCreateAndUpdateForEntity(
        //     entity,
        //     tx,
        //   );
        // }
        if (ops?.isOfflineFirstDbOperations) {
            (0, _utils.fixUpTheRefCollection)(entity);
        }
        const toUpdate = (0, _mappingUtils.mapToPlain)(entity);
        await this._dbProvider.onlyCreate((0, _utils.getFullCollection)(entity.id.refcollection, ops, '.', entity.meta_workspace), toUpdate, id, tx);
    }
    async upsert(entity, ops) {
        const tx = !!ops && !!ops.tx ? ops.tx.transaction : null;
        (0, _utils.setUpdatedFields)(entity, ops);
        const id = entity.id.id;
        if (!id) {
            const id = entity.properties ? entity.properties['customId'] : null;
            if (!id) {
                throw Error('It has to be provided');
            }
            if (!entity.id) {
                entity.setId(id);
            }
            (0, _utils.setCreatedFields)(entity, ops);
        // await this.setAuthTagWhenNeeded(entity, ops);
        }
        if (!entity.meta_workspace) {
            throw Error('meta_workspace');
        }
        if (!entity.meta_organisation) {
            throw Error('meta_organisation');
        }
        if (!entity.meta_configkey) {
            throw Error('meta_configkey');
        }
        // let entityValues = null;
        // if (!!ops && !!ops.expandChildren) {
        //   entityValues = await this.processChildrenCreateAndUpdateForEntity(
        //     entity,
        //     tx,
        //   );
        // }
        if (ops?.isOfflineFirstDbOperations) {
            (0, _utils.fixUpTheRefCollection)(entity);
        }
        const toUpdate = (0, _mappingUtils.mapToPlain)(entity);
        await this._dbProvider.upsert((0, _utils.getFullCollection)(entity.id.refcollection, ops, '.', entity.meta_workspace), toUpdate, id, tx);
    }
    async all(collection) {
        return this._dbProvider.all(collection);
    }
    constructor(dbProvider){
        this.processChildrenCreateAndUpdateForEntity = async (entity, tx)=>{
            const results = {};
            await (0, _ormUtils.processUpdateAndCreateChildren)(entity, this.updateObjectInDb, this.createObjectInDb, results, tx);
            return results;
        };
        this.getOneByDefinition = async (dataSourceSchema, options, entityScope = {})=>{
            try {
                const filters = typeof dataSourceSchema.filters != 'undefined' && dataSourceSchema.filters.length > 0 ? dataSourceSchema.filters : [];
                const ordering = typeof dataSourceSchema.ordering != 'undefined' && dataSourceSchema.ordering.length > 0 ? dataSourceSchema.ordering : [];
                // if (dataSourceSchema.sourceJsonata) {
                //   const val = this._jsonServices.execJsonata(
                //     entityScope,
                //     dataSourceSchema.sourceJsonata,
                //   );
                //   return {
                //     values: val,
                //   };
                // }
                const pagedResult = await this.search(dataSourceSchema.source, {
                    filters,
                    ordering,
                    ...options
                }, entityScope);
                let { values: entities } = pagedResult;
                // dont think we need these transformations!!
                // if (dataSourceSchema.transformations && entities.length) {
                //   for (const [
                //     transformIndex,
                //     transform,
                //   ] of dataSourceSchema.transformations.entries()) {
                //     const label = `getOneByDefinition.transform ${transformIndex} ${dataSourceSchema.source}`;
                //     try {
                //       entities = await this._jsonServices.transformJSON(
                //         transform,
                //         entities,
                //         this,
                //         this._configProvider.originalConfig.settings,
                //       );
                //     } catch (error) {
                //       console.error(error);
                //     }
                //   }
                // }
                pagedResult.values = entities;
                return pagedResult;
            } catch (e) {
                console.error('Error with transformation probably', dataSourceSchema, e);
                throw e;
            }
        };
        this.getAllById = async (ids, cls, ops)=>{
            if (ids && ids.length > 0) {
                const collection = ids[0].refcollection;
                const type = this.getFullCollection(collection, ops);
                const chunkedIds = this.sliceIntoChunks(ids.map((m)=>m.id), 10);
                const resultChunks = await Promise.all(chunkedIds.map(async (chunk)=>{
                    const collectionObjects = await this._dbProvider.getAllById(type, chunk);
                    if (collectionObjects && collectionObjects.length > 0) {
                        const oObjects = await (0, _ormUtils.mapManyFromPlainAndExpand)(collectionObjects, collection, this.getObjectByReferenceFromDb, ops);
                        return oObjects;
                    }
                    return [];
                }));
                return resultChunks.flat();
            }
            return [];
        };
        this.getAllBy = async (cls, ops)=>{
            return this.getAll((0, _mappingUtils.getCollectionKeyByClass)(cls), ops);
        };
        this.getAll = async (collection, ops)=>{
            const res = this.getAllItemsForCollection(collection, ops);
            return res;
        };
        this.getAllItemsForCollection = async (collection, ops)=>{
            try {
                // this._authProvider.user
                const res = await this.search(collection, {
                    ops
                });
                return res.values;
            // const collectionObjects = await this._dbProvider.all(this.getFullCollection(collection));
            // if (collectionObjects && collectionObjects.length > 0) {
            //   const oObjects = mapManyFromPlainAndExpand(collectionObjects, collection, this.getObjectByReferenceFromDb, ops);
            //   return oObjects;
            // }
            // return [];
            } catch (error) {
                throw error;
            }
        };
        this.searchBy = async (cls, options)=>{
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return this.search((0, _mappingUtils.getCollectionKeyByClass)(cls), options);
        };
        this.preProcessFilters = async (options = {}, initializationScope = {})=>{
            const noFetch = false;
            initializationScope = {
                ...initializationScope
            };
            if (!options.filters && !options.filters) {
                options.filters = [];
            }
            if (options.filters) {
                // console.log('callApiDb0', options.filters);
                // console.log('callApiDb.initializationScope', initializationScope);
                const changedFilters = {};
                let filters = await Promise.all(options.filters.map(async (filter)=>{
                    filter = await this.replaceOneFilterValue(changedFilters, filter, 'value', initializationScope);
                    filter = await this.replaceOneFilterValue(changedFilters, filter, 'key', initializationScope);
                    return filter;
                }));
                // console.log('callApiDb.filters1', filters);
                filters = filters.filter((filter)=>{
                    const changedFilter = changedFilters[filter.key];
                    if (changedFilter) {
                        if (changedFilter.oldValue != null && changedFilter.newValue == null) {
                            return false;
                        }
                    }
                    return true;
                });
                // console.log('FS callApiDb.filters2 after', filters);
                return {
                    ...options,
                    filters: filters
                };
            }
            return options;
        };
        this.searchOne = async (collection, options = {}, entityScope = {})=>{
            const values = (await this.search(collection, options, entityScope)).values;
            if (values.length === 0) {
                return null;
            }
            if (values.length > 1) {
                throw Error(`should only return one ${collection} ${JSON.stringify(options)}`);
            }
            return values[0];
        };
        this.search = async (collection, options = {}, entityScope = {})=>{
            const timeKey = this.getSearchTimerKey(collection, options);
            try {
                options = await this.preProcessFilters(options, entityScope);
            } catch (e) {
                if (e.msg === 'FILTERVALUEEMPTY') return {
                    values: []
                };
            }
            let ops = options;
            if (!ops) {
                ops = {};
            }
            if (ops.ops && options.ops.applyAC) {
                throw Error('not implemented, copy from V1 if needed');
            // if (ops.ops && options.ops.applyAC && !this._userAuthState.su) {
            // const rules = this.parseAcRules(collection);
            // if (!options.filters) {
            //   options.filters = [];
            // }
            // options.filters.push(...rules);
            // const pagedResultPromise = await this.executeSearch(collection, options);
            // const pagedResult = this.applyRolesForResult(pagedResultPromise, ops.ops);
            // console.log(
            //   'FS executeSearch result after roles filter' + collection,
            //   pagedResult.values,
            //   options.filters,
            // );
            // return pagedResult;
            } else {
                return this.executeSearch(collection, options);
            }
        };
        this.findObjectsByProperty = async (collection, property, propertyvalue, single, ops)=>{
            try {
                if (!propertyvalue) {
                    return null;
                }
                console.log('FS findObjectsByProperty ' + collection);
                const res = await this._dbProvider.filter(this.getFullCollection(collection, ops), {
                    filters: [
                        {
                            key: property,
                            operation: '==',
                            value: propertyvalue
                        }
                    ]
                });
                const objects = res.values;
                if (objects && objects.length > 0) {
                    const returnObject = (0, _utils.objectToClass)(single ? objects[0] : objects, collection, this.getObjectByReferenceFromDb, ops);
                    return returnObject;
                }
                return null;
            } catch (error) {
                throw error;
            }
        };
        this.getObjectByReferenceFromDb = async (objectId, ops)=>{
            try {
                const objectRef = (0, _utils.getObjectId)(objectId);
                if (!objectRef) {
                    throw Error('object ref not defined');
                }
                const collection = objectRef.refcollection;
                const fromdb = await this._dbProvider.get(this.getFullCollection(objectRef.refcollection, ops), objectRef.id, ops);
                const entity = await (0, _ormUtils.mapOneObjectFromPlainAndExpand)(objectRef, fromdb, collection, this.getObjectByReferenceFromDb, ops);
                return entity;
            } catch (error) {
                throw error;
            }
        };
        this.getTransaction = ()=>{
            return {
                transaction: this._dbProvider.getTransaction(),
                dataHolder: {}
            };
        };
        this.commit = async (transaction)=>{
            return this._dbProvider.commit(transaction.transaction);
        };
        this.create = async (entity, ops)=>{
            return this.createObjectInDb(entity, ops);
        };
        this.setAuthTagWhenNeeded = async (entity, ops)=>{
            if (ops?.targetEntityTag === '<FROMUSER>') {
                // const user = this.getCurrentUserAccount();
                throw Error('not implemented, copy from V1 if needed');
            //
            // let items =
            //   this._configProvider.originalConfig.settings.authSettings.rolesOther.filter(
            //     (r) => r.name === user.workspaceRole[this._configProvider.currentWorkSpace.id]
            //   );
            // const items = this.getCurrentRulesRoles();
            // if (!items[0]) {
            //   throw Error(
            //     'user has to have a role if entity needs to be saved with tag',
            //   );
            // }
            //
            // entity.id.authTag = items[0].tag;
            } else if (ops?.targetEntityTag && ops?.targetEntityTag.startsWith('<FROM_TARGET_OPERATOR>')) {
                // const operator = ops.executionScope['TARGET_OPERATOR'];
                // if (!operator) {
                //   throw Error(
                //     'if using <FROM_TARGET_OPERATOR>. operator has to be in scope',
                //   );
                // }
                throw Error('not supported, if needed copy from V1');
            // let user = await this.getBy(operator, Account);
            // if (!user.workspaceRole) {
            //   throw Error(`user has to have a role if entity needs to be saved with tag  ${JSON.stringify(user)}`);
            // }
            // const items = this.getCurrentRulesRoles();
            //
            // if (!items[0]) {
            //   throw Error(
            //     'user has to have a role if entity needs to be saved with tag',
            //   );
            // }
            // throw Error("not implemented, copy from V1 if needed")
            //
            // entity.id.authTag = items[0].tag;
            } else if (ops?.targetEntityTag && ops?.targetEntityTag.startsWith('#JSONATA#')) {
                const exp = ops.targetEntityTag.replace('#JSONATA#', '');
                // const result = this._jsonServices.execJsonata({ entity: entity }, exp);
                throw Error('not implemented');
            // entity.id.authTag = result;
            } else if (ops?.targetEntityTag) {
                entity.id.authTag = ops.targetEntityTag;
            }
            entity.id.authRoles = ops?.targetRoles;
        };
        this.createObjectInDb = async (entity, ops)=>{
            try {
                if (!this._dbProvider) {
                    throw new Error('DB not defined.');
                }
                const tx = !!ops && !!ops.tx ? ops.tx.transaction : null;
                let entityValues = null;
                if (!!ops && !!ops.expandChildren) {
                    entityValues = await this.processChildrenCreateAndUpdateForEntity(entity, tx);
                }
                await this.setCreatedFields(entity, ops);
                entity.updatedBy = entity.createdBy;
                entity.updatedDate = entity.createdDate;
                entity.updatedLocation = entity.createdLocation;
                let id = entity.properties ? entity.properties['customId'] : null;
                if (!id) {
                    id = (0, _uuid.v4)();
                }
                if (!entity.id) {
                    entity.setId(id);
                }
                await this.setAuthTagWhenNeeded(entity, ops);
                const tag = entity.id.authTag;
                if (ops?.isOfflineFirstDbOperations) {
                    (0, _utils.fixUpTheRefCollection)(entity);
                }
                const data = (0, _mappingUtils.mapToPlain)(entity);
                const type = this.getFullCollection(entity.getCollection(), ops);
                await this._dbProvider.set(type, this.wrapDataWithOrgDetails(data, ops), id, tx);
                if (!!ops && !!ops.expandChildren) {
                    await (0, _ormUtils.mergeChildrenBackToParent)(entity, entityValues);
                }
                return entity;
            } catch (error) {
                throw error;
            }
        };
        this.update = async (entity, ops)=>{
            return this.updateObjectInDb(entity, ops);
        };
        this.updateObjectInDb = async (entity, ops)=>{
            try {
                if (!this._dbProvider) {
                    throw new Error('DB not defined.');
                }
                const tx = !!ops && !!ops.tx ? ops.tx.transaction : null;
                await this.setUpdatedFields(entity, ops);
                const id = entity.id.id;
                if (!id) {
                    throw Error('id has to be defined for update');
                }
                let entityValues = null;
                if (!!ops && !!ops.expandChildren) {
                    entityValues = await this.processChildrenCreateAndUpdateForEntity(entity, tx);
                }
                if (ops?.isOfflineFirstDbOperations) {
                    (0, _utils.fixUpTheRefCollection)(entity);
                }
                const toUpdate = (0, _mappingUtils.mapToPlain)(entity);
                await this._dbProvider.update(this.getFullCollection(entity.id.refcollection, ops), this.wrapDataWithOrgDetails(toUpdate, ops), id, tx);
                if (!!ops && !!ops.expandChildren) {
                    await (0, _ormUtils.mergeChildrenBackToParent)(entity, entityValues);
                }
                return entity;
            } catch (error) {
                throw error;
            }
        };
        this.deleteById = async (id, cls, ops)=>{
            const objectId = new _ObjectId.ObjectId(id, (0, _mappingUtils.getCollectionKeyByClass)(cls));
            await this.deleteObject(objectId, ops);
        };
        this.delete = async (objectRef, ops)=>{
            return this.deleteObject(objectRef, ops);
        };
        this.unDelete = async (objectRef, ops)=>{
            return this.undoSoftDeleteObject(objectRef, ops);
        };
        this.softDelete = async (objectRef, ops)=>{
            return this.softDeleteObject(objectRef, ops);
        };
        this.undoSoftDeleteObject = async (objectRef, ops)=>{
            const entity = await this.getObjectByReferenceFromDb(objectRef, {
                ...ops,
                includeDeleted: true
            });
            entity.isDeleted = false;
            if (!entity) {
                throw Error('entity doesnt exist with ' + objectRef.idString);
            }
            const tx = !!ops && !!ops.tx ? ops.tx.transaction : null;
            const txFull = !!ops && !!ops.tx ? ops.tx : null;
            await (0, _ormUtils.handleCascadingDeleteForChildren)(entity, this.undoSoftDeleteObject, txFull);
            await this.update(entity, ops);
        };
        this.softDeleteObject = async (objectRef, ops)=>{
            const entity = await this.getObjectByReferenceFromDb(objectRef);
            if (entity) {
                entity.isDeleted = true;
                if (!entity) {
                    throw Error('entity doesnt exist with ' + objectRef.idString);
                }
                const tx = !!ops && !!ops.tx ? ops.tx.transaction : null;
                const txFull = !!ops && !!ops.tx ? ops.tx : null;
                await (0, _ormUtils.handleCascadingDeleteForChildren)(entity, this.softDeleteObject, txFull);
                await this.update(entity, ops);
            }
        };
        this.deleteObject = async (objectRef, ops)=>{
            const entity = await this.getObjectByReferenceFromDb(objectRef, ops);
            if (!entity) {
                throw Error('entity doesnt exist with ' + objectRef.idString);
            }
            const tx = !!ops && !!ops.tx ? ops.tx.transaction : null;
            const txFull = !!ops && !!ops.tx ? ops.tx : null;
            await (0, _ormUtils.handleCascadingDeleteForChildren)(entity, this.deleteObject, txFull);
            const promise = await this._dbProvider.delete(this.getFullCollection(objectRef.refcollection, ops), objectRef.id, tx);
        };
        this._dbProvider = dbProvider;
    }
};
OrmProvider = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _FirestoreDBProvider.FirestoreDBProvider === "undefined" ? Object : _FirestoreDBProvider.FirestoreDBProvider
    ])
], OrmProvider);
