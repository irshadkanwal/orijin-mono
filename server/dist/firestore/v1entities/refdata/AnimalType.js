"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return AnimalType;
    }
});
const _dbMappingUtils = require("../../v1utils/dbMappingUtils");
const _AbstractEntity = require("../utis/AbstractEntity");
let AnimalType = class AnimalType extends _AbstractEntity.AbstractEntity {
    getCollection() {
        return _dbMappingUtils.collectionKeys.animaltypes;
    }
    constructor(...args){
        super(...args);
        this.name = null;
        this.scientificName = null;
        this.translations = null;
        this.commonNames = null;
    }
};
