"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FarmAreaValidator", {
    enumerable: true,
    get: function() {
        return FarmAreaValidator;
    }
});
const _common = require("@nestjs/common");
const _ruleFunctionsservice = require("../ruleFunctions.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let FarmAreaValidator = class FarmAreaValidator {
    async execute(farm) {
        return this.ruleFunctionsService.isPolygonCorrect(farm);
    }
    constructor(ruleFunctionsService){
        this.ruleFunctionsService = ruleFunctionsService;
    }
};
FarmAreaValidator = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _ruleFunctionsservice.RuleFunctionsService === "undefined" ? Object : _ruleFunctionsservice.RuleFunctionsService
    ])
], FarmAreaValidator);
