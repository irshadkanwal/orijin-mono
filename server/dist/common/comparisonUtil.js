"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getObjectDifferences", {
    enumerable: true,
    get: function() {
        return getObjectDifferences;
    }
});
const _client = require("@prisma/client");
const _classvalidator = require("class-validator");
const isObject = (obj)=>{
    return obj !== null && typeof obj === 'object';
};
const difference = (oldObject, newObject)=>{
    const diff = {};
    // Get all keys from the first object
    const keys = new Set([
        ...Object.keys(oldObject),
        ...Object.keys(newObject)
    ]);
    for (const key of keys){
        if (key in newObject) {
            let o = oldObject[key];
            let n = newObject[key];
            if (o instanceof _client.Prisma.Decimal || n instanceof _client.Prisma.Decimal) {
                o = o?.toString();
                n = n?.toString();
            }
            if (o instanceof Date || n instanceof Date) {
                o = o?.toISOString();
                n = n?.toISOString();
            }
            if ((0, _classvalidator.isArray)(o) || (0, _classvalidator.isArray)(n)) {
                if (o !== n) {
                    diff[key] = {
                        oldValue: o,
                        newValue: n
                    };
                }
            } else if (isObject(o) && isObject(n)) {
                // Recursively get the differences of nested objects
                const nestedDiff = difference(o, n);
                if (Object.keys(nestedDiff).length > 0) {
                    diff[key] = nestedDiff;
                }
            } else if (o === undefined && isObject(n)) {
                const nestedDiff = difference({}, n);
                if (Object.keys(nestedDiff).length > 0) {
                    diff[key] = nestedDiff;
                }
            } else if (n === undefined && isObject(o)) {
                const nestedDiff = difference(o, {});
                if (Object.keys(nestedDiff).length > 0) {
                    diff[key] = nestedDiff;
                }
            } else if (n !== o) {
                // If the values are different, add them to the diff
                diff[key] = {
                    oldValue: o,
                    newValue: n
                };
            }
        } else {
            // Removed keys
            diff[key] = {
                oldValue: oldObject[key],
                newValue: undefined
            };
        }
    }
    return diff;
};
const getObjectDifferences = (oldObject, newObject, skipDatesAndSuch = false)=>{
    if (skipDatesAndSuch) {
        const { createdAt: createdAtOld, updatedAt: updatedAtOld, ...restOfOldObject } = oldObject;
        const { createdAt: createdAtNew, updatedAt: updatedAtNew, ...restOfNewObject } = newObject;
        return difference(restOfOldObject, restOfNewObject);
    } else {
        return difference(oldObject, newObject);
    }
};
