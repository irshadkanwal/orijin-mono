"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ScoringModule", {
    enumerable: true,
    get: function() {
        return ScoringModule;
    }
});
const _common = require("@nestjs/common");
const _scoringservice = require("./scoring.service");
const _rulemodule = require("../rule/rule.module");
const _scoringcontroller = require("./scoring.controller");
const _ruleValidationmodule = require("../rule/lib/ruleValidations/ruleValidation.module");
const _farmsmodule = require("../farms/farms.module");
const _ruleFunctionFactorymodule = require("../rule/lib/ruleValidations/factory/ruleFunctionFactory.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ScoringModule = class ScoringModule {
};
ScoringModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _rulemodule.RuleModule,
            _ruleValidationmodule.RuleValidationModule,
            _farmsmodule.FarmsModule,
            _ruleFunctionFactorymodule.RuleFunctionFactoryModule
        ],
        controllers: [
            _scoringcontroller.ScoringController
        ],
        providers: [
            _scoringservice.ScoringService
        ],
        exports: [
            _scoringservice.ScoringService
        ]
    })
], ScoringModule);
