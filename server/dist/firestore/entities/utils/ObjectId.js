"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ObjectId", {
    enumerable: true,
    get: function() {
        return ObjectId;
    }
});
let ObjectId = class ObjectId {
    get idString() {
        return this.refcollection + '/' + this.id;
    }
    equals(id) {
        return this.id == id.id && this.refcollection == id.refcollection;
    }
    constructor(id, refcollection, labelShort, name){
        this.id = id;
        this.refcollection = refcollection;
        this.labelShort = labelShort;
        this.name = name;
    }
};
