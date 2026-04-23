"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return TrainingTypeCategoryV1;
    }
});
const _AbstractEntity = require("../utis/AbstractEntity");
let TrainingTypeCategoryV1 = class TrainingTypeCategoryV1 extends _AbstractEntity.AbstractEntity {
    getCollection() {
        return 'trainingtypecategories';
    }
    constructor(...args){
        super(...args);
        this.name = null;
    }
};
