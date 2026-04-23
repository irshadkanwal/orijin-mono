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
    cascadingDelete: function() {
        return cascadingDelete;
    },
    expandFromId: function() {
        return expandFromId;
    },
    expandOnLoad: function() {
        return expandOnLoad;
    },
    getCascadingDeletes: function() {
        return getCascadingDeletes;
    },
    getChildenToExpand: function() {
        return getChildenToExpand;
    },
    getChildrenToExpandFromOtherProperty: function() {
        return getChildrenToExpandFromOtherProperty;
    },
    getChildrenToMapToObjectId: function() {
        return getChildrenToMapToObjectId;
    },
    getChildrenToProcessFurther: function() {
        return getChildrenToProcessFurther;
    },
    mapToObjectId: function() {
        return mapToObjectId;
    },
    processMyChildren: function() {
        return processMyChildren;
    }
});
require("reflect-metadata");
const mapToObjectIdKey = 'childToProcessKey';
const expandOnLoadKey = 'expandOnLoadKey';
const expandFromIdKey = 'expandFromId';
const cascadingDeleteKey = 'cascadingDelete';
const processMyChildrenKey = 'processMyChildrenKey';
function expandFromId(targetPropertyId) {
    return Reflect.metadata(expandFromIdKey, targetPropertyId);
}
function expandOnLoad() {
    return Reflect.metadata(expandOnLoadKey, true);
}
function processMyChildren() {
    return Reflect.metadata(processMyChildrenKey, true);
}
function cascadingDelete() {
    return Reflect.metadata(cascadingDeleteKey, true);
}
function mapToObjectId(collection) {
    return Reflect.metadata(mapToObjectIdKey, collection);
}
function getChildrenToExpandFromOtherProperty(target, propertyKey) {
    return Reflect.getMetadata(expandFromIdKey, target, propertyKey);
}
function getChildenToExpand(target, propertyKey) {
    return Reflect.getMetadata(expandOnLoadKey, target, propertyKey);
}
function getChildrenToProcessFurther(target, propertyKey) {
    return Reflect.getMetadata(processMyChildrenKey, target, propertyKey);
}
function getChildrenToMapToObjectId(target, propertyKey) {
    return Reflect.getMetadata(mapToObjectIdKey, target, propertyKey);
}
function getCascadingDeletes(target, propertyKey) {
    return Reflect.getMetadata(cascadingDeleteKey, target, propertyKey);
}
