"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _ruleservice = require("./rule.service");
const _ruleconstroller = require("./rule.constroller");
describe('RuleController', ()=>{
    let controller;
    let service;
    const mockRules = [];
    const mockRuleService = {
        getAllRules: jest.fn().mockResolvedValue(mockRules)
    };
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            controllers: [
                _ruleconstroller.RuleController
            ],
            providers: [
                {
                    provide: _ruleservice.RuleService,
                    useValue: mockRuleService
                }
            ]
        }).compile();
        controller = module.get(_ruleconstroller.RuleController);
        service = module.get(_ruleservice.RuleService);
    });
    describe('getRules', ()=>{
        it('should return an array of rules', async ()=>{
            const result = await controller.getRules();
            expect(result).toEqual(mockRules);
            expect(service.getAllRules).toHaveBeenCalled();
        });
    });
});
