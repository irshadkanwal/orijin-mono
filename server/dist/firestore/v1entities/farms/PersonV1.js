"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return PersonV1;
    }
});
const _classtransformer = require("class-transformer");
const _utils = require("../../v1utils/utils");
const _dbMappingUtils = require("../../v1utils/dbMappingUtils");
const _AbstractEntity = require("../utis/AbstractEntity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let PersonV1 = class PersonV1 extends _AbstractEntity.AbstractEntity {
    getCollection() {
        return _dbMappingUtils.collectionKeys.persons;
    }
    constructor(...args){
        super(...args);
        this.name = null;
        this.relationshipToPrincipal = null;
        this.firstName = null;
        this.middleName = null;
        this.lastName = null;
        this.gender = null;
        this.dob = null;
        this.dobApproximate = null;
        this.identificationNumber = null;
        this.identificationNumberType = null;
        this.education = null;
        this.maritalStatus = null;
    }
};
_ts_decorate([
    (0, _classtransformer.Transform)(({ value })=>(0, _utils.formatDatesForFS)(value)),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], PersonV1.prototype, "dob", void 0);
