"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return TrainingTypeV1;
    }
});
const _dbMappingUtils = require("../../v1utils/dbMappingUtils");
const _AbstractEntity = require("../utis/AbstractEntity");
let TrainingTypeV1 = class TrainingTypeV1 extends _AbstractEntity.AbstractEntity {
    getCollection() {
        return _dbMappingUtils.collectionKeys.trainingtypes;
    }
    constructor(...args){
        super(...args);
        this.name = null;
        this.type = null;
    }
};
