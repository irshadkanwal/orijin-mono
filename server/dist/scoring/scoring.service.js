"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ScoringService", {
    enumerable: true,
    get: function() {
        return ScoringService;
    }
});
const _common = require("@nestjs/common");
const _nestjsprisma = require("nestjs-prisma");
const _ruleFunctionFactoryservice = require("../rule/lib/ruleValidations/factory/ruleFunctionFactory.service");
const _ruleservice = require("../rule/rule.service");
const _farmsservice = require("../farms/farms.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ScoringService = class ScoringService {
    async runScoring(org, ruleIDs, farmID) {
        const farm = await this.farmService.getOne({
            id: farmID,
            org
        });
        for (const ruleID of ruleIDs){
            try {
                const rule = await this.ruleService.getOne(ruleID);
                if (!rule) {
                    throw new _common.NotFoundException(`Rule (${ruleID}) not found.`);
                }
                const score = await this.evaluateRule(rule.functionType, [
                    farm
                ]);
                const scoring = await this.prisma.scoringResult.create({
                    data: {
                        ruleName: rule.name,
                        scoreValue: score
                    }
                });
                return scoring;
            } catch (error) {
                throw error;
            }
        }
    }
    async getScoringResults(scoringID) {
        return this.prisma.scoringResult.findMany({
            where: {
                id: scoringID
            }
        });
    }
    async evaluateRule(type, args) {
        if (type === 'FARM_AREA_VALIDATOR') {
            const validator = this.ruleFunctionFactory.getValidator(type);
            const valid = await validator.execute(...args);
            if (valid) return 100;
            else return 0;
        } else {
            //TODO implement Custom function from rule.functionCode
            return 0;
        }
    }
    constructor(prisma, ruleFunctionFactory, ruleService, farmService){
        this.prisma = prisma;
        this.ruleFunctionFactory = ruleFunctionFactory;
        this.ruleService = ruleService;
        this.farmService = farmService;
    }
};
ScoringService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService,
        typeof _ruleFunctionFactoryservice.RuleFunctionFactory === "undefined" ? Object : _ruleFunctionFactoryservice.RuleFunctionFactory,
        typeof _ruleservice.RuleService === "undefined" ? Object : _ruleservice.RuleService,
        typeof _farmsservice.FarmsService === "undefined" ? Object : _farmsservice.FarmsService
    ])
], ScoringService);
