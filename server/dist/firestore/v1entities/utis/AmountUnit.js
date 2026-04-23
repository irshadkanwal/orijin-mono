"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return AmountUnit;
    }
});
let AmountUnit = class AmountUnit {
    constructor(amount, unit){
        this.amount = amount;
        this.unit = unit;
    }
};
