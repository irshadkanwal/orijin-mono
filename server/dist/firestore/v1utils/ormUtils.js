"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    createCacheKeyForSearch: function() {
        return createCacheKeyForSearch;
    },
    createCacheKeyForget: function() {
        return createCacheKeyForget;
    },
    expandChildren: function() {
        return expandChildren;
    },
    expandOneChild: function() {
        return expandOneChild;
    },
    expandOneChildFromOtherProperty: function() {
        return expandOneChildFromOtherProperty;
    },
    fixUpFSDates: function() {
        return fixUpFSDates;
    },
    fixUpTheRefCollection: function() {
        return fixUpTheRefCollection;
    },
    fixUpTheRefCollectionForCollectionString: function() {
        return fixUpTheRefCollectionForCollectionString;
    },
    handleCascadingDeleteForChildren: function() {
        return handleCascadingDeleteForChildren;
    },
    mapManyFromPlainAndExpand: function() {
        return mapManyFromPlainAndExpand;
    },
    mapOneObjectFromPlainAndExpand: function() {
        return mapOneObjectFromPlainAndExpand;
    },
    mergeChildrenBackToParent: function() {
        return mergeChildrenBackToParent;
    },
    objectToClass: function() {
        return objectToClass;
    },
    processUpdateAndCreateChildren: function() {
        return processUpdateAndCreateChildren;
    },
    processUpdateAndCreateChildrenWithKey: function() {
        return processUpdateAndCreateChildrenWithKey;
    }
});
const _loglevel = /*#__PURE__*/ _interop_require_default(require("loglevel"));
const _utils = require("./utils");
const _ormAnnotations = require("./ormAnnotations");
const _mappingUtils = require("./mappingUtils");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function createCacheKeyForSearch(prefix, collection, options) {
    let key = collection;
    if (options.ordering) {
        key = key + '_' + options.ordering.map((o)=>{
            return o.key + '_' + o.direction;
        });
    }
    if (options.filters) {
        key = key + '_' + options.filters.map((o)=>{
            return o.key + '_' + o.operation + '_' + o.value;
        });
    }
    return (prefix ? prefix + '_' : '') + key;
}
function createCacheKeyForget(prefix, collection, id) {
    return (prefix ? prefix + '_' : '') + collection + '_' + id;
}
function fixUpTheRefCollectionForCollectionString(baseCollection) {
    const suffix = '_wip';
    if (baseCollection.indexOf('formsubmissions') < 0 && baseCollection.indexOf('documents') < 0 && // baseCollection.indexOf("pendingtasks") < 0&&
    baseCollection.indexOf(suffix) < 0) {
        const s = baseCollection + '_wip';
        return s;
    }
    return baseCollection;
}
function fixUpTheRefCollection(entity) {
    const baseCollection = entity.getCollection();
    entity.getCollection = function() {
        return fixUpTheRefCollectionForCollectionString(baseCollection);
    };
    const baseCollection2 = entity.id.refcollection;
    entity.id.refcollection = fixUpTheRefCollectionForCollectionString(baseCollection2);
}
async function processUpdateAndCreateChildrenWithKey(key, results, entity, // eslint-disable-next-line @typescript-eslint/ban-types
updateCallBack, // eslint-disable-next-line @typescript-eslint/ban-types
createCallBack, tx) {
    const collection = (0, _ormAnnotations.getChildrenToMapToObjectId)(entity, key);
    const val = Reflect.get(entity, key);
    console.log('processUpdateAndCreateChildrenWithKey', collection, val);
    if (Array.isArray(val)) {
        const resultArray = [];
        for (const item of val){
            let child = item;
            if (!child.getCollection) {
                child = (0, _mappingUtils.mapOneObjectFromPlain)(child, collection);
            }
            if (child.id && child.id.id) {
                await updateCallBack(child, {
                    tx
                });
            } else {
                child = await createCallBack(child, {
                    tx
                });
            }
            results[child.id.id] = child;
            resultArray.push(child.id);
        }
        Reflect.set(entity, key, resultArray);
    } else {
        let child = val;
        if (child != null) {
            if (!child.getCollection) {
                child = (0, _mappingUtils.mapOneObjectFromPlain)(child, collection);
            }
            if (child.id && child.id.id) {
                await updateCallBack(child, {
                    tx
                });
                Reflect.set(entity, key, child.id);
                results[child.id.id] = child;
            } else {
                const returnedChild = await createCallBack(child, {
                    tx
                });
                Reflect.set(entity, key, returnedChild.id);
                results[returnedChild.id.id] = returnedChild;
            }
        }
    }
}
function fixUpFSDates(obj) {
    for(const i in obj){
        if (obj.hasOwnProperty(i)) {
            if (obj[i] === undefined) {
                delete obj[i];
            } else if (obj[i] instanceof Array) {
                const array = obj[i];
                for (const a of array){
                    if (a instanceof Object) {
                        fixUpFSDates(a);
                    }
                }
            } else if (obj[i] instanceof Object) {
                const oo = obj[i];
                if (oo.nanoseconds != undefined && oo.seconds != undefined) {
                    obj[i] = new Date(oo.seconds * 1000 + oo.nanoseconds / 1000000);
                } else {
                    fixUpFSDates(oo);
                }
            }
        }
    }
}
async function mapOneObjectFromPlainAndExpand(objectRef, plainObject, collection, // eslint-disable-next-line @typescript-eslint/ban-types
getObjectByReferenceFromDb, ops) {
    const entity = (0, _mappingUtils.mapOneObjectFromPlain)(plainObject, collection);
    //TODO: just in case the ids should be set for the objects!!!???
    if (entity && !entity.id) {
        entity.id = objectRef;
    }
    if (entity && !!ops && !!ops.expandChildren) {
        await expandChildren(entity, getObjectByReferenceFromDb, ops);
    }
    if (entity) {
        fixUpFSDates(entity);
    }
    return entity;
}
async function processUpdateAndCreateChildren(entity, // eslint-disable-next-line @typescript-eslint/ban-types
updateCallBack, // eslint-disable-next-line @typescript-eslint/ban-types
createCallBack, results, tx) {
    for (const key of Reflect.ownKeys(entity)){
        if ((0, _ormAnnotations.getChildrenToProcessFurther)(entity, key)) {
            const val = Reflect.get(entity, key);
            await processUpdateAndCreateChildren(val, updateCallBack, createCallBack, results, tx);
        } else if ((0, _ormAnnotations.getChildrenToMapToObjectId)(entity, key)) {
            await processUpdateAndCreateChildrenWithKey(key, results, entity, updateCallBack, createCallBack, tx);
        }
    }
}
async function expandOneChild(key, entity, // eslint-disable-next-line @typescript-eslint/ban-types
getObjectByReferenceFromDb, ops) {
    const val = Reflect.get(entity, key);
    if (Array.isArray(val)) {
        const resultArray = [];
        for (const item of val){
            console.log('FS CACHE fetching children in array');
            try {
                if (!(0, _utils.getObjectId)(item)) {
                    _loglevel.default.error('children marked with expand annotation have to be of type ObjectId ' + key.toString(), item);
                    _loglevel.default.error('array', val);
                    _loglevel.default.error('Check your entity', entity);
                    throw Error('children marked with expand annotation have to be of type ObjectId ');
                }
            } catch (e) {
                _loglevel.default.debug('Errror in object', e);
                throw e;
            }
            const child = await getObjectByReferenceFromDb(item, {
                ...ops,
                expandChildren: true
            });
            resultArray.push(child);
        }
        Reflect.set(entity, key, resultArray);
    } else {
        if (val) {
            try {
                if (!(0, _utils.getObjectId)(val)) {
                    _loglevel.default.error('Check your entity', entity);
                    _loglevel.default.error('children marked with expand annotation have to be of type ObjectId ' + key.toString(), val);
                    throw Error('children marked with expand annotation have to be of type ObjectId ');
                }
            } catch (e) {
                _loglevel.default.debug('aa', e);
                throw e;
            }
            const child = await getObjectByReferenceFromDb(val, ops);
            Reflect.set(entity, key, child);
        }
    }
}
async function expandOneChildFromOtherProperty(key, entity, // eslint-disable-next-line @typescript-eslint/ban-types
getObjectByReferenceFromDb, targetKey, ops) {
    const val = Reflect.get(entity, key);
    const IdValueObject = Reflect.get(entity, targetKey);
    if (IdValueObject) {
        if (Array.isArray(IdValueObject)) {
            // let resultArray = [];
            const resultArray = await Promise.all(IdValueObject.filter((item)=>item ? true : false).map((item)=>{
                if (!(0, _utils.getObjectId)(item)) {
                    _loglevel.default.error('children marked with expand annotation have to be of type ObjectId ' + key.toString(), item);
                    _loglevel.default.error('array', val);
                    _loglevel.default.error('Check your entity', entity);
                    throw Error('children marked with expand annotation have to be of type ObjectId ');
                }
                return getObjectByReferenceFromDb(item, {
                    ...ops,
                    expandChildren: false
                });
            }));
            // for (let item of val) {
            //   try {
            //
            //   } catch (e) {
            //     log.debug("Errror in object", e);
            //     throw e;
            //   }
            //   let child = await getObjectByReferenceFromDb(item);
            //   resultArray.push(child);
            // }
            Reflect.set(entity, key, resultArray);
        } else {
            if (IdValueObject) {
                try {
                    if (!(0, _utils.getObjectId)(IdValueObject)) {
                        _loglevel.default.error('Check your entity', entity);
                        _loglevel.default.error('children marked with expand annotation have to be of type ObjectId ' + key.toString(), val);
                        throw Error('children marked with expand annotation have to be of type ObjectId ');
                    }
                } catch (e) {
                    _loglevel.default.debug('aa', e);
                    throw e;
                }
                const child = await getObjectByReferenceFromDb(IdValueObject, ops);
                Reflect.set(entity, key, child);
            }
        }
    }
}
async function objectToClass(object, collection, // eslint-disable-next-line @typescript-eslint/ban-types
getObjectByReferenceFromDb, ops) {
    if (object) {
        if (Array.isArray(object)) {
            if (object.length > 0) {
                return mapManyFromPlainAndExpand(object.map((o)=>{
                    return o;
                }), collection, getObjectByReferenceFromDb, ops);
            }
        } else {
            return mapOneObjectFromPlainAndExpand(null, object, collection, getObjectByReferenceFromDb, ops);
        }
    }
    return null;
}
async function mapManyFromPlainAndExpand(querySnapshot, collection, // eslint-disable-next-line @typescript-eslint/ban-types
getObjectByReferenceFromDb, ops) {
    const results = querySnapshot.map((o)=>{
        return mapOneObjectFromPlainAndExpand(null, o, collection, getObjectByReferenceFromDb, ops);
    });
    return Promise.all(results);
}
async function expandChildren(entity, // eslint-disable-next-line @typescript-eslint/ban-types
getObjectByReferenceFromDb, ops) {
    const keys = Reflect.ownKeys(entity);
    await Promise.all(keys.map(async (key)=>{
        if (!ops.expandChildrenIncludeKeys || (ops.expandChildrenIncludeKeys || []).indexOf(key) >= 0) {
            if (!ops.expandChildrenExcludeKeys || (ops.expandChildrenExcludeKeys || []).indexOf(key) < 0) {
                if ((0, _ormAnnotations.getChildrenToProcessFurther)(entity, key)) {
                    const val = Reflect.get(entity, key);
                    await expandChildren(val, getObjectByReferenceFromDb, ops);
                } else if (!!(0, _ormAnnotations.getChildrenToExpandFromOtherProperty)(entity, key)) {
                    await expandOneChildFromOtherProperty(key, entity, getObjectByReferenceFromDb, (0, _ormAnnotations.getChildrenToExpandFromOtherProperty)(entity, key), ops);
                } else if ((0, _ormAnnotations.getChildenToExpand)(entity, key) == true) {
                    await expandOneChild(key, entity, getObjectByReferenceFromDb, ops);
                }
            }
        }
    }));
// for (const key of keys) {
//   if(!ops.expandChildrenIncludeKeys || (ops.expandChildrenIncludeKeys || []).indexOf(key as string)>=0) {
//
//     if(!ops.expandChildrenExcludeKeys ||  (ops.expandChildrenExcludeKeys ||[]).indexOf(key as string) < 0 ) {
//       if (getChildrenToProcessFurther(entity, <string>key)) {
//         let val = Reflect.get(entity, key);
//         await expandChildren(val, getObjectByReferenceFromDb, ops);
//       } else if (!!getChildrenToExpandFromOtherProperty(entity, <string>key)) {
//         await expandOneChildFromOtherProperty(<string>key, entity, getObjectByReferenceFromDb, getChildrenToExpandFromOtherProperty(entity, <string>key));
//       } else if (getChildenToExpand(entity, <string>key) == true) {
//         await expandOneChild(<string>key, entity, getObjectByReferenceFromDb);
//       }
//     }
//   }
// }
}
async function handleCascadingDeleteForChildren(entity, // eslint-disable-next-line @typescript-eslint/ban-types
deleteObject, tx) {
    for (const key of Reflect.ownKeys(entity)){
        if ((0, _ormAnnotations.getCascadingDeletes)(entity, key) == true) {
            const val = Reflect.get(entity, key);
            if (Array.isArray(val)) {
                for (const item of val){
                    try {
                        if ((0, _utils.isObjectId)(item)) {
                            await deleteObject(item, {
                                tx
                            });
                        } else {
                            await deleteObject(item.id, {
                                tx
                            });
                        }
                    } catch (e) {
                        console.warn('Problem with casdading delete, can be ignored ', e);
                    }
                }
            } else {
                try {
                    if ((0, _utils.isObjectId)(val)) {
                        await deleteObject(val, {
                            tx
                        });
                    } else {
                        const v = val;
                        await deleteObject(v.id, {
                            tx
                        });
                    }
                } catch (e) {
                    console.warn('Problem with casdading delete, can be ignored ', e);
                }
            }
        }
    }
}
async function mergeChildrenBackToParent(entity, entityValues) {
    for (const key of Reflect.ownKeys(entity)){
        if ((0, _ormAnnotations.getChildrenToProcessFurther)(entity, key)) {
            const val = Reflect.get(entity, key);
            await mergeChildrenBackToParent(val, entityValues);
        } else if ((0, _ormAnnotations.getChildrenToMapToObjectId)(entity, key)) {
            const collection = (0, _ormAnnotations.getChildrenToMapToObjectId)(entity, key);
            const val = Reflect.get(entity, key);
            if (Array.isArray(val)) {
                const resultArray = [];
                for (const item of val){
                    const child = item;
                    resultArray.push(entityValues[child.id]);
                }
                Reflect.set(entity, key, resultArray);
            } else {
                const child = val;
                if (child) {
                    Reflect.set(entity, key, entityValues[child.id]);
                }
            }
        }
    }
}
