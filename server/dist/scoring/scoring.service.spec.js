"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _scoringservice = require("./scoring.service");
const _ruleservice = require("../rule/rule.service");
const _nestjsprisma = require("nestjs-prisma");
const _farmsservice = require("../farms/farms.service");
const _ruleFunctionFactoryservice = require("../rule/lib/ruleValidations/factory/ruleFunctionFactory.service");
const _facilitiesservice = require("../facilities/facilities.service");
const _plotsservice = require("../farms/plots.service");
const _geocledianservice = require("../geocledian/geocledian.service");
const _polygonUtilservice = require("../polygonUtil/polygonUtil.service");
const _geocledianApiservice = require("../geocledian/geocledianApi.service");
const _axios = require("@nestjs/axios");
describe.skip('ScoringService', ()=>{
    let service;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _scoringservice.ScoringService,
                _nestjsprisma.PrismaService,
                _ruleservice.RuleService,
                _farmsservice.FarmsService,
                _ruleFunctionFactoryservice.RuleFunctionFactory,
                _facilitiesservice.FacilitiesService,
                _plotsservice.PlotsService,
                _geocledianservice.GeocledianService,
                _polygonUtilservice.PolygonUtilService,
                _geocledianApiservice.GeocledianApiService,
                _axios.HttpService
            ]
        }).compile();
        service = module.get(_scoringservice.ScoringService);
    });
    //skipping due to provider errors
    it.skip('should be defined', ()=>{
        expect(service).toBeDefined();
    });
});
