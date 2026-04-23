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
    fixUpFSDates: function() {
        return fixUpFSDates;
    },
    handleCascadingDeleteForChildren: function() {
        return handleCascadingDeleteForChildren;
    },
    mapOneObjectFromPlainAndExpand: function() {
        return mapOneObjectFromPlainAndExpand;
    }
});
const _mappingUtils = require("./mappingUtils");
const _ormAnnotations = require("./ormAnnotations");
const _utils = require("./utils");
async function mapOneObjectFromPlainAndExpand(objectRef, plainObject, collection) {
    const entity = (0, _mappingUtils.mapOneObjectFromPlain)(plainObject, collection);
    //TODO: just in case the ids should be set for the objects!!!???
    if (entity && !entity.id) {
        entity.id = objectRef;
    }
    return entity;
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
