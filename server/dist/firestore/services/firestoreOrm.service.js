"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FirestoreOrmService", {
    enumerable: true,
    get: function() {
        return FirestoreOrmService;
    }
});
const _common = require("@nestjs/common");
const _DbMappingUtils = require("../entities/utils/DbMappingUtils");
const _ObjectId = require("../entities/utils/ObjectId");
const _utils = require("../entities/utils/utils");
const _firestoreDbservice = require("./firestoreDb.service");
const _uuid = require("uuid");
const _mappingUtils = require("../entities/utils/mappingUtils");
const _ormUtils = require("../entities/utils/ormUtils");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let FirestoreOrmService = class FirestoreOrmService {
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
    async replaceOneFilterValue(changedFilters, filter, key, initializationScope = {}) {
        let noFetch = false;
        const value = filter[key];
        if (value && String(value).includes('#')) {
            if (Object.entries(initializationScope).length === 0 && initializationScope.constructor === Object) {
                noFetch = true;
            }
            const newValue = null;
            if (value.startsWith('#JSONATA#')) {
                throw Error('not supported, if needed copy from V1');
            } else if (String(newValue).includes('#')) {
                console.log('Replace didnt work ' + value, initializationScope);
            } else {
                throw Error('not supported, if needed copy from V1');
            }
            if (String(newValue).includes('#')) {
                console.log('REplace didnt work ' + value, initializationScope);
            }
            if (newValue == null) {
                throw Error('FILTER_VALUE_EMPTY');
            }
            changedFilters[filter.key] = {
                oldValue: value,
                newValue
            };
            const newVar = {
                ...filter,
                [key]: newValue
            };
            return newVar;
        }
        return filter;
    }
    async executeSearch(collection, options) {
        let fullCollection = collection;
        let result = null;
        if (!result) {
            result = await this.firestoreDBService.filter(fullCollection, options);
        }
        return result;
    }
    async findSingle(collection, property, propertyValue, ops) {
        return this.findObjectsByProperty(collection, property, propertyValue, true, ops);
    }
    async findBy(property, propertyvalue, cls, ops) {
        return this.findObjectsByProperty((0, _DbMappingUtils.getCollectionKeyByClass)(cls), property, propertyvalue, true, ops);
    }
    async getById(id, cls, ops) {
        let collectionKeyByClass = (0, _DbMappingUtils.getCollectionKeyByClass)(cls);
        const objectId = new _ObjectId.ObjectId(id, collectionKeyByClass);
        return this.getObjectByReferenceFromDb(objectId, ops);
    }
    wrapDataWithOrgDetails(data, ops) {
        const workspaceData = data;
        workspaceData.meta_configkey = ops.configKey;
        return workspaceData;
    }
    async all(collection) {
        return this.firestoreDBService.all(collection);
    }
    constructor(firestoreDBService){
        this.getAllBy = async (cls, ops)=>{
            return this.getAll((0, _DbMappingUtils.getCollectionKeyByClass)(cls), ops);
        };
        this.getAll = async (collection, ops)=>{
            const res = this.getAllItemsForCollection(collection, ops);
            return res;
        };
        this.getAllItemsForCollection = async (collection, ops)=>{
            try {
                const res = await this.search(collection, {
                    ops
                });
                return res.values;
            } catch (error) {
                throw error;
            }
        };
        this.searchBy = async (cls, options)=>{
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return this.search((0, _DbMappingUtils.getCollectionKeyByClass)(cls), options);
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
                const changedFilters = {};
                let filters = await Promise.all(options.filters.map(async (filter)=>{
                    filter = await this.replaceOneFilterValue(changedFilters, filter, 'value', initializationScope);
                    filter = await this.replaceOneFilterValue(changedFilters, filter, 'key', initializationScope);
                    return filter;
                }));
                filters = filters.filter((filter)=>{
                    const changedFilter = changedFilters[filter.key];
                    if (changedFilter) {
                        if (changedFilter.oldValue != null && changedFilter.newValue == null) {
                            return false;
                        }
                    }
                    return true;
                });
                return {
                    ...options,
                    filters: filters
                };
            }
            return options;
        };
        this.search = async (collection, options = {}, entityScope = {})=>{
            try {
                options = await this.preProcessFilters(options, entityScope);
            } catch (e) {
                if (e.msg === 'FILTER_VALUE_EMPTY') return {
                    values: []
                };
            }
            let ops = options;
            if (!ops) {
                ops = {};
            }
            return this.executeSearch(collection, options);
        };
        this.findObjectsByProperty = async (collection, property, propertyValue, single, ops)=>{
            try {
                if (!propertyValue) {
                    return null;
                }
                const res = await this.firestoreDBService.filter(collection, {
                    filters: [
                        {
                            key: property,
                            operation: '==',
                            value: propertyValue
                        }
                    ]
                });
                const objects = res.values;
                if (objects && objects.length > 0) {
                    const returnObject = (0, _utils.objectToClass)(single ? objects[0] : objects, collection);
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
                const fromDB = await this.firestoreDBService.get(objectRef.refcollection, objectRef.id, ops);
                const entity = await (0, _ormUtils.mapOneObjectFromPlainAndExpand)(objectRef, fromDB, collection);
                return entity;
            } catch (error) {
                throw error;
            }
        };
        this.getTransaction = ()=>{
            return {
                transaction: this.firestoreDBService.getTransaction(),
                dataHolder: {}
            };
        };
        this.commit = async (transaction)=>{
            return this.firestoreDBService.commit(transaction.transaction);
        };
        this.create = async (entity, ops)=>{
            return this.createObjectInDb(entity, ops);
        };
        this.createObjectInDb = async (entity, ops)=>{
            try {
                if (!this.firestoreDBService) {
                    throw new Error('DB not defined.');
                }
                const tx = !!ops && !!ops.tx ? ops.tx.transaction : null;
                await this.setCreatedFields(entity, ops);
                entity.updatedBy = entity.createdBy;
                entity.updatedDate = entity.createdDate;
                let id = entity.properties ? entity.properties['customId'] : null;
                if (!id) {
                    id = (0, _uuid.v4)();
                }
                if (!entity.id) {
                    entity.setId(id);
                }
                const data = (0, _mappingUtils.mapToPlain)(entity);
                const type = entity.getCollection();
                const responseOfSet = await this.firestoreDBService.set(type, this.wrapDataWithOrgDetails(data, ops), id, tx);
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
                if (!this.firestoreDBService) {
                    throw new Error('DB not defined.');
                }
                const tx = !!ops && !!ops.tx ? ops.tx.transaction : null;
                await this.setUpdatedFields(entity, ops);
                const id = entity.id.id;
                if (!id) {
                    throw Error('id has to be defined for update');
                }
                let entityValues = null;
                const toUpdate = (0, _mappingUtils.mapToPlain)(entity);
                await this.firestoreDBService.update(entity.id.refcollection, this.wrapDataWithOrgDetails(toUpdate, ops), id, tx);
                return entity;
            } catch (error) {
                throw error;
            }
        };
        this.deleteById = async (id, cls, ops)=>{
            const objectId = new _ObjectId.ObjectId(id, (0, _DbMappingUtils.getCollectionKeyByClass)(cls));
            await this.deleteObject(objectId, ops);
        };
        this.delete = async (objectRef, ops)=>{
            return this.deleteObject(objectRef, ops);
        };
        this.deleteObject = async (objectRef, ops)=>{
            const entity = await this.getObjectByReferenceFromDb(objectRef, ops);
            if (!entity) {
                throw Error('entity doesnt exist with ' + objectRef.idString);
            }
            const tx = !!ops && !!ops.tx ? ops.tx.transaction : null;
            const txFull = !!ops && !!ops.tx ? ops.tx : null;
            await (0, _ormUtils.handleCascadingDeleteForChildren)(entity, this.deleteObject, txFull);
            const promise = await this.firestoreDBService.delete(objectRef.refcollection, objectRef.id, tx);
        };
        this.firestoreDBService = firestoreDBService;
    }
};
FirestoreOrmService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _firestoreDbservice.FirestoreDBService === "undefined" ? Object : _firestoreDbservice.FirestoreDBService
    ])
], FirestoreOrmService);
