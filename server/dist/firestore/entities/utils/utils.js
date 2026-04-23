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
    applyDeleted: function() {
        return applyDeleted;
    },
    applyDeletedArray: function() {
        return applyDeletedArray;
    },
    constructDefaultWorkspaceNameMaster: function() {
        return constructDefaultWorkspaceNameMaster;
    },
    constructDefaultWorkspaceNameTest: function() {
        return constructDefaultWorkspaceNameTest;
    },
    createUniqueIdOfName: function() {
        return createUniqueIdOfName;
    },
    formatDatesForFS: function() {
        return formatDatesForFS;
    },
    getObjectId: function() {
        return getObjectId;
    },
    isObjectId: function() {
        return isObjectId;
    },
    mapManyFromPlainAndExpand: function() {
        return mapManyFromPlainAndExpand;
    },
    mapOneObjectFromPlainAndExpand: function() {
        return mapOneObjectFromPlainAndExpand;
    },
    mapPlainToClass: function() {
        return mapPlainToClass;
    },
    objectToClass: function() {
        return objectToClass;
    },
    shouldDeletedBeIncluded: function() {
        return shouldDeletedBeIncluded;
    }
});
const _classtransformer = require("class-transformer");
const _ObjectId = require("./ObjectId");
const _mappingUtils = require("./mappingUtils");
const _ormUtils = require("./ormUtils");
function constructDefaultWorkspaceNameMaster(org) {
    return `${org}_master`;
}
function constructDefaultWorkspaceNameTest(org) {
    return `${org}_test`;
}
function formatDatesForFS(date) {
    if (date == null) {
        return null;
    }
    // console.log("formatDatesForFS", date)
    if (date.getTime) {
        const newVar = {
            type: 'customDate',
            ms: date.getTime()
        };
        // console.log("formatDatesForFS: to FS", newVar)
        return newVar;
    }
    if (date.toDate) {
        // console.log("formatDatesForFS: from FS", date)
        return date.toDate();
    }
    if (date.nanoseconds != undefined && date.seconds != undefined) {
        // console.log('formatDatesForFS: from FS raw', date);
        //firebase date that is a plain object
        //{ _seconds: 1692524417, _nanoseconds: 7000000 }
        return new Date(date.seconds * 1000 + date.nanoseconds / 1000000);
    }
    // Timestamp { _seconds: 1692524417, _nanoseconds: 7000000 }
    //this is returning a firestore date into normal in case we never went to firestore (unit test)
    if (date.type === 'customDate') {
        // console.log('formatDatesForFS: from FS customDate ', date);
        if (!date.ms) {
            return null;
        }
        return new Date(date.ms);
    }
    try {
        console.log('formatDatesForFS: to fs:  NOT SURE WHY HERE', date);
        const d = new Date(date);
        if (d.getTime) {
            return {
                type: 'customDate',
                ms: d.getTime()
            };
        }
    } catch (e) {
        console.log('should not be here either', date);
    }
    console.log('should not be here', date);
    throw Error('should not be here');
}
function isObjectId(input) {
    const input1 = input;
    return input1?.id !== undefined && input1?.refcollection !== undefined;
}
function getObjectId(input) {
    if (isObjectId(input)) {
        const instance = JSON.parse(JSON.stringify(input));
        return mapPlainToClass(_ObjectId.ObjectId, instance);
    } else {
        console.log('Needs to be a raw or typed objectId ', JSON.stringify(input));
        console.log('Needs to be a raw or typed objectId ', input);
        throw Error('Needs to be a raw or typed objectId ' + JSON.stringify(input));
    }
}
function mapPlainToClass(cls, plainObject) {
    // let plain = addUnderscore(plainObject, null);
    const result = (0, _classtransformer.plainToClass)(cls, plainObject);
    return result;
}
function applyDeleted(newVar, ops) {
    return shouldDeletedBeIncluded(newVar, ops) ? newVar : null;
}
function shouldDeletedBeIncluded(newVar, ops) {
    if (!newVar) {
        return false;
    }
    if (!ops && (newVar.isDeleted || newVar.isArchived)) {
        return false;
    }
    if (!newVar.isDeleted && !newVar.isArchived) {
        return true;
    }
    let res = true;
    if (newVar.isArchived) {
        res = ops.includeArchived;
    }
    if (newVar.isDeleted) {
        res = ops.includeDeleted;
    }
    return res;
}
function replaceAll(me, str1, str2, ignore) {
    return me.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, '\\$&'), ignore ? 'gi' : 'g'), typeof str2 == 'string' ? str2.replace(/\$/g, '$$$$') : str2);
}
function createUniqueIdOfName(name) {
    name = replaceAll(name, ' ', '_');
    return name;
}
function applyDeletedArray(newVar, ops) {
    return newVar.filter((v)=>shouldDeletedBeIncluded(v, ops));
}
async function objectToClass(object, collection) {
    if (object) {
        if (Array.isArray(object)) {
            if (object.length > 0) {
                return mapManyFromPlainAndExpand(object.map((o)=>{
                    return o;
                }), collection);
            }
        } else {
            return mapOneObjectFromPlainAndExpand(null, object, collection);
        }
    }
    return null;
}
async function mapManyFromPlainAndExpand(querySnapshot, collection) {
    const results = querySnapshot.map((o)=>{
        return mapOneObjectFromPlainAndExpand(null, o, collection);
    });
    return Promise.all(results);
}
async function mapOneObjectFromPlainAndExpand(objectRef, plainObject, collection) {
    const entity = (0, _mappingUtils.mapOneObjectFromPlain)(plainObject, collection);
    if (entity && !entity.id) {
        entity.id = objectRef;
    }
    if (entity) {
        (0, _ormUtils.fixUpFSDates)(entity);
    }
    return entity;
}
