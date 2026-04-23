"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ObjectIdUser", {
    enumerable: true,
    get: function() {
        return ObjectIdUser;
    }
});
const _DbMappingUtils = require("./DbMappingUtils");
const _ObjectId = require("./ObjectId");
let ObjectIdUser = class ObjectIdUser extends _ObjectId.ObjectId {
    constructor(id, email){
        super(id, _DbMappingUtils.collectionKeys.platformusers);
        this.email = email;
    }
};
