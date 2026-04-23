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
    mapOneObjectFromPlain: function() {
        return mapOneObjectFromPlain;
    },
    mapToPlain: function() {
        return mapToPlain;
    }
});
const _classtransformer = require("class-transformer");
const _DbMappingUtils = require("./DbMappingUtils");
function mapToPlain(entity) {
    const result = (0, _classtransformer.classToPlain)(entity);
    return result;
}
function mapOneObjectFromPlain(plainObject, collection) {
    const classType = (0, _DbMappingUtils.getClassType)(collection);
    cleanPlainObjectDates(plainObject);
    if (plainObject instanceof classType) {
        return plainObject;
    } else {
        return (0, _classtransformer.plainToClass)(classType, plainObject);
    }
}
function cleanPlainObjectDates(obj) {
    for(const i in obj){
        if (obj.hasOwnProperty(i)) {
            if (obj[i] === undefined) {
                delete obj[i];
            } else if (obj[i] instanceof Array) {
                const array = obj[i];
                for (const a of array){
                    if (a instanceof Object) {
                        cleanPlainObjectDates(a);
                    }
                }
            } else if (obj[i] instanceof Object) {
                if (obj[i].toDate) {
                    obj[i] = {
                        seconds: obj[i].seconds,
                        nanoseconds: obj[i].nanoseconds
                    };
                } else {
                    cleanPlainObjectDates(obj[i]);
                }
            }
        }
    }
}
