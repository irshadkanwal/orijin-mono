"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return CropV1;
    }
});
const _dbMappingUtils = require("../../v1utils/dbMappingUtils");
const _AbstractEntity = require("../utis/AbstractEntity");
let CropV1 = class CropV1 extends _AbstractEntity.AbstractEntity {
    getCollection() {
        return _dbMappingUtils.collectionKeys.crops;
    }
    constructor(name){
        super();
        this.name = null;
        this.name = name;
    }
};
