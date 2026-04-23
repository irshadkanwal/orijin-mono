"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RuleController", {
    enumerable: true,
    get: function() {
        return RuleController;
    }
});
const _common = require("@nestjs/common");
const _ruleservice = require("./rule.service");
const _ruledto = require("./dto/rule.dto");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let RuleController = class RuleController {
    async getRules() {
        return this.ruleService.getAllRules();
    }
    async getRuleById(id) {
        return this.ruleService.getOne(id);
    }
    async createRule(createRuleDto) {
        return this.ruleService.createRule(createRuleDto);
    }
    async updateRule(id, updateRuleDto) {
        return this.ruleService.updateRule(id, updateRuleDto);
    }
    async deleteRule(id) {
        return this.ruleService.deleteRule(id);
    }
    constructor(ruleService){
        this.ruleService = ruleService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], RuleController.prototype, "getRules", null);
_ts_decorate([
    (0, _common.Get)('/:id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], RuleController.prototype, "getRuleById", null);
_ts_decorate([
    (0, _common.Post)(),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _ruledto.CreateRuleDto === "undefined" ? Object : _ruledto.CreateRuleDto
    ]),
    _ts_metadata("design:returntype", Promise)
], RuleController.prototype, "createRule", null);
_ts_decorate([
    (0, _common.Patch)('/:id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _ruledto.UpdateRuleDto === "undefined" ? Object : _ruledto.UpdateRuleDto
    ]),
    _ts_metadata("design:returntype", Promise)
], RuleController.prototype, "updateRule", null);
_ts_decorate([
    (0, _common.Delete)('/:id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], RuleController.prototype, "deleteRule", null);
RuleController = _ts_decorate([
    (0, _common.Controller)('rules'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _ruleservice.RuleService === "undefined" ? Object : _ruleservice.RuleService
    ])
], RuleController);
