"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RuleFunctionFactoryModule", {
    enumerable: true,
    get: function() {
        return RuleFunctionFactoryModule;
    }
});
const _common = require("@nestjs/common");
const _ruleFunctionFactoryservice = require("./ruleFunctionFactory.service");
const _ruleValidatorservice = require("../ruleValidator.service");
const _ruleValidationmodule = require("../ruleValidation.module");
const _ruleFunctionsservice = require("../../ruleFunctions.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let RuleFunctionFactoryModule = class RuleFunctionFactoryModule {
};
RuleFunctionFactoryModule = _ts_decorate([
    (0, _common.Module)({
        providers: [
            _ruleFunctionFactoryservice.RuleFunctionFactory,
            _ruleValidatorservice.FarmAreaValidator,
            _ruleFunctionsservice.RuleFunctionsService
        ],
        exports: [
            _ruleFunctionFactoryservice.RuleFunctionFactory
        ],
        imports: [
            _ruleValidationmodule.RuleValidationModule
        ]
    })
], RuleFunctionFactoryModule);
