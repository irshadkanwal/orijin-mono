"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return QualityControlResultSubmissionItem;
    }
});
let QualityControlResultSubmissionItem = class QualityControlResultSubmissionItem {
    constructor(){
        this.name = null;
        this.note = null;
        this.quality = null;
        this.intensity = null;
        this.noScore = false;
        this.formula = null;
        this.score = null;
        this.descriptors = [];
    }
};
