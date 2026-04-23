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
    DateWrapper: function() {
        return DateWrapper;
    },
    REDUNDANT_FIELDS: function() {
        return REDUNDANT_FIELDS;
    },
    addIdToArrayIfNotExists: function() {
        return addIdToArrayIfNotExists;
    },
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
    expandChildren: function() {
        return expandChildren;
    },
    filterCondition: function() {
        return filterCondition;
    },
    filterRedundantFields: function() {
        return filterRedundantFields;
    },
    fixUpTheRefCollection: function() {
        return fixUpTheRefCollection;
    },
    fixUpTheRefCollectionForCollectionString: function() {
        return fixUpTheRefCollectionForCollectionString;
    },
    formatDatesForFS: function() {
        return formatDatesForFS;
    },
    getFullCollection: function() {
        return getFullCollection;
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
    objectToClass: function() {
        return objectToClass;
    },
    parseLocationHierarchyStart: function() {
        return parseLocationHierarchyStart;
    },
    setCreatedFields: function() {
        return setCreatedFields;
    },
    setUpdatedFields: function() {
        return setUpdatedFields;
    },
    setupIdFields: function() {
        return setupIdFields;
    },
    shouldDeletedBeIncluded: function() {
        return shouldDeletedBeIncluded;
    },
    transformUserV2: function() {
        return transformUserV2;
    }
});
const _classtransformer = require("class-transformer");
const _dbMappingUtils = require("./dbMappingUtils");
const _ObjectId = require("../v1entities/utis/ObjectId");
const _mappingUtils = require("./mappingUtils");
const _ormUtils = require("./ormUtils");
const _ormAnnotations = require("./ormAnnotations");
const _UserV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/org/UserV1"));
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
function constructDefaultWorkspaceNameMaster(org) {
    return `${org}_master24`;
}
function constructDefaultWorkspaceNameTest(org) {
    return `${org}_test24`;
}
function setupIdFields(res, input, meta) {
    res.id = new _ObjectId.ObjectId(input.id, res.getCollection());
    res.id.labelShort = input.shortCode;
    res.meta_organisation = meta.organisation;
    res.meta_workspace = meta.workspace;
    res.meta_configkey = meta.configKey;
    res.sourceSystem = 'V2';
    // res.createdBy = input.createdAt;
    // res.createdDate = input.createdAt;
    // res.updatedBy = 'V2';
    // res.updatedDate = 'V2';
    return res;
}
function transformUserV2(mainContactPerson, farm, meta) {
    const res = new _UserV1.default();
    setupIdFields(res, mainContactPerson, meta);
    res.type = mainContactPerson.type;
    res.phone = mainContactPerson.phone;
    res.phone2 = mainContactPerson.phone2;
    res.name = mainContactPerson.firstName + ' ' + mainContactPerson.lastName;
    res.id.label = res.name;
    res.firstName = mainContactPerson.firstName;
    res.lastName = mainContactPerson.lastName;
    res.gender = mainContactPerson.gender;
    res.middleName = mainContactPerson.middleName;
    res.nickName = mainContactPerson.nickName;
    res.education = mainContactPerson.education;
    res.maritalStatus = mainContactPerson.maritalStatus;
    res.identificationNumber = mainContactPerson.identificationNumber;
    res.identificationNumberType = mainContactPerson.identificationNumberType;
    res.dobApproximate = mainContactPerson.dateOfBirthApproximate;
    res.dob = mainContactPerson.dateOfBirth ? new Date(mainContactPerson.dateOfBirth) : null;
    if (mainContactPerson.mainContactPersonFor && mainContactPerson?.mainContactPersonFor[0]) {
        res.contactPersonForFacility = new _ObjectId.ObjectId(farm.id, 'farms');
        res.contactPersonForFacility.label = farm.facility.name;
        res.contactPersonForFacility.labelShort = farm.facility.shortCode;
        console.log('res.contactPersonForFacility,', res.contactPersonForFacility);
        if (mainContactPerson?.mainContactPersonFor[0].location) {
            const location = mainContactPerson?.mainContactPersonFor[0]?.location;
            parseLocationHierarchyStart(res, location);
            const myLocation = location;
            const parentLocationId = new _ObjectId.ObjectId(myLocation.id, 'locations');
            parentLocationId.labelShort = myLocation.shortCode;
            parentLocationId.label = myLocation.name;
            //VILLAGE
            res.parentLocation = parentLocationId;
            if (myLocation.parent) {
                const parentLocationParentId = new _ObjectId.ObjectId(myLocation.parent.id, 'locations');
                parentLocationParentId.labelShort = myLocation.parent.shortCode;
                parentLocationParentId.label = myLocation.parent.name;
                //PARISH
                res.parentLocationParent = parentLocationParentId;
                if (myLocation.parent.parent) {
                    const parentLOcationParentParentId = new _ObjectId.ObjectId(myLocation.parent.parent.id, 'locations');
                    parentLOcationParentParentId.labelShort = myLocation.parent.parent.shortCode;
                    parentLOcationParentParentId.label = myLocation.parent.parent.name;
                    //SUB COUNTY
                    res.parentLocationParentParent = parentLOcationParentParentId;
                    if (myLocation.parent.parent.parent) {
                        const parentLocationParentParentParentId = new _ObjectId.ObjectId(myLocation.parent.parent.parent.id, 'locations');
                        parentLocationParentParentParentId.labelShort = myLocation.parent.parent.parent.shortCode;
                        parentLocationParentParentParentId.label = myLocation.parent.parent.parent.name;
                        //DISTRCIT
                        res.parentLocationParentParentParent = parentLocationParentParentParentId;
                    }
                }
            }
        } else {
            console.log('Location or facility not available');
        }
    }
    return res;
}
function parseLocationHierarchyStart(result, location) {
    if (!location) {
        return;
    }
    if (location.type === 'SubCounty') {
        result.parentLocationParentParentCode = location.shortCode;
        result.parentLocationParentParentName = location.name;
    } else if (location.type === 'District') {
        result.parentLocationParentParentParentCode = location.shortCode;
        result.parentLocationParentParentParentName = location.name;
    } else if (location.type === 'Village') {
        result.parentLocationCode = location.shortCode;
        result.parentLocationName = location.name;
    } else if (location.type === 'Parish') {
        result.parentLocationParentCode = location?.shortCode;
        result.parentLocationParentName = location?.name;
    } else if (location.type === 'CollectionPoint') {} else if (location.type === 'Farmergroups') {} else if (location.type === 'Zone') {} else if (location.type === 'Region') {} else {
        throw Error('unknonwn location type ' + location.type);
    }
    parseLocationHierarchyStart(result, location.parent);
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
let DateWrapper = class DateWrapper {
};
_ts_decorate([
    (0, _classtransformer.Transform)(({ value })=>formatDatesForFS(value)),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], DateWrapper.prototype, "date", void 0);
function fixUpTheRefCollectionForCollectionString(baseCollection) {
    const suffix = '_wip';
    if (baseCollection.indexOf('formsubmissions') < 0 && baseCollection.indexOf('documents') < 0 && // baseCollection.indexOf("pendingtasks") < 0&&
    baseCollection.indexOf(suffix) < 0) {
        const s = baseCollection + '_wip';
        return s;
    }
    return baseCollection;
}
function replaceAll(me, str1, str2, ignore) {
    return me.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, '\\$&'), ignore ? 'gi' : 'g'), typeof str2 == 'string' ? str2.replace(/\$/g, '$$$$') : str2);
}
function createUniqueIdOfName(name) {
    name = replaceAll(name, ' ', '_');
    return name;
}
function isObjectId(input) {
    const input1 = input;
    return input1?.id !== undefined && input1?.refcollection !== undefined;
}
function getObjectId(input) {
    if (isObjectId(input)) {
        const instance = JSON.parse(JSON.stringify(input));
        return (0, _mappingUtils.mapPlainToClass)(_ObjectId.ObjectId, instance);
    } else {
        console.log('Needs to be a raw or typed objectId ', JSON.stringify(input));
        console.log('Needs to be a raw or typed objectId ', input);
        throw Error('Needs to be a raw or typed objectId ' + JSON.stringify(input));
    }
}
function fixUpTheRefCollection(entity) {
    const baseCollection = entity.getCollection();
    entity.getCollection = function() {
        return fixUpTheRefCollectionForCollectionString(baseCollection);
    };
    const baseCollection2 = entity.id.refcollection;
    entity.id.refcollection = fixUpTheRefCollectionForCollectionString(baseCollection2);
}
function getFullCollection(path, ops, delimeter = '.', ws) {
    if ((0, _dbMappingUtils.isGlobalCollection)(path)) {
        return path;
    } else {
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
function setUpdatedFields(object, ops) {
    object.updatedBy = new _ObjectId.ObjectId('importscript', 'importscript');
    object.updatedDate = new Date();
}
function setCreatedFields(object, ops) {
    object.createdBy = new _ObjectId.ObjectId('importscript', 'importscript');
    object.createdDate = new Date();
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
const filterCondition = (object, filters)=>{
    throw Error('not implemented');
// try {
//   const conditions = (filters || []).map((filter) => {
//     const objectValue = jmespath.search(object, filter.key);
//     if (filter.operation === 'undefinedOrNull') {
//       return objectValue ? false : true;
//     } else if (filter.operation === 'notUndefinedOrNull') {
//       return objectValue ? true : false;
//     } else if (filter.operation === 'in') {
//       return (filter.value as string[]).includes(objectValue as string);
//     } else if (filter.operation === 'array-contains') {
//       const filterValue = filter.value as any;
//       const targetValue = objectValue as [];
//       // @ts-ignore
//       return targetValue.indexOf(filterValue) >= 0;
//       // return filterStringArray.some(totest=> targetValue.indexOf(totest)>=0)
//     } else {
//       const stringExpression = `"${String(filter.value)}" ${
//         filter.operation
//       } "${String(objectValue)}"`;
//       return eval(stringExpression);
//     }
//   });
//
//   return conditions.includes(false) ? false : true;
// } catch (error) {
//   throw error;
// }
};
function applyDeleted(newVar, ops) {
    return shouldDeletedBeIncluded(newVar, ops) ? newVar : null;
}
function applyDeletedArray(newVar, ops) {
    return newVar.filter((v)=>shouldDeletedBeIncluded(v, ops));
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
        (0, _ormUtils.fixUpFSDates)(entity);
    }
    return entity;
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
                    await (0, _ormUtils.expandOneChildFromOtherProperty)(key, entity, getObjectByReferenceFromDb, (0, _ormAnnotations.getChildrenToExpandFromOtherProperty)(entity, key), ops);
                } else if ((0, _ormAnnotations.getChildenToExpand)(entity, key) == true) {
                    await (0, _ormUtils.expandOneChild)(key, entity, getObjectByReferenceFromDb, ops);
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
function addIdToArrayIfNotExists(array, item) {
    if (item) {
        const existing = array.find((m)=>m.id == item.id);
        if (!existing) {
            array.push(item);
        }
    }
}
const REDUNDANT_FIELDS = new Set([
    'meta_workspace',
    'meta_organisation',
    'meta_configkey',
    'isArchived',
    'isDeleted',
    'creationStatus',
    'approvalStatus',
    'v1ToV2Status',
    'v1ToV2StatusOriginal',
    'sourceSystem',
    'systemStatus',
    'statusReason',
    'properties',
    'getCollection',
    'updatedBy',
    'updatedDate',
    'createdDate',
    'createdBy',
    'lastModified',
    'storagePath',
    'enabled',
    'followUpDate',
    'displayColour',
    'parentFacility',
    'parentFacilityParent',
    'parentFacilityParentParent',
    'parentLocationCode',
    'parentLocationName',
    'parentLocationParentCode',
    'parentLocationParentName',
    'parentLocationParentParent',
    'parentLocationParentParentCode',
    'parentLocationParentParentName',
    'parentLocationParentParentParent',
    'parentLocationParentParentParentCode',
    'parentLocationParentParentParentName',
    'correctiveActionType',
    'correctiveActionDescription',
    'correctiveActionResponsiblePerson',
    'correctiveActionDeadlineDate'
]);
function filterRedundantFields(data) {
    return data.map((item)=>{
        const filteredItem = {
            ...item
        };
        Object.keys(filteredItem).forEach((key)=>{
            if (REDUNDANT_FIELDS.has(key)) {
                delete filteredItem[key];
            }
        });
        return filteredItem;
    });
}
