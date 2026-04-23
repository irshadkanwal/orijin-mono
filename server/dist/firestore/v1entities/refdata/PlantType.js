"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return PlantType;
    }
});
const _dbMappingUtils = require("../../v1utils/dbMappingUtils");
const _AbstractEntity = require("../utis/AbstractEntity");
let PlantType = class PlantType extends _AbstractEntity.AbstractEntity {
    getCollection() {
        return _dbMappingUtils.collectionKeys.planttypes;
    }
    constructor(...args){
        super(...args);
        this.name = null;
        this.scientificName = null;
        this.translations = null;
        this.commonNames = null;
        this.tags = null;
        this.minHeight = null;
        this.maxHeight = null;
        this.standardHeight = null;
        this.isTree = false;
        this.isNative = false;
        this.isPioneer = false;
        this.isCommon = false;
        this.isTimber = false;
        this.isPalm = false;
        this.isExotic = false;
        this.isShortLived = false;
        this.isFruit = false;
    }
};
