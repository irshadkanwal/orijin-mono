"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _scoringcontroller = require("./scoring.controller");
const _scoringservice = require("./scoring.service");
describe('ScoringController', ()=>{
    let controller;
    let service;
    const mockScoringService = {
        getScoringResults: jest.fn(),
        runScoring: jest.fn()
    };
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            controllers: [
                _scoringcontroller.ScoringController
            ],
            providers: [
                {
                    provide: _scoringservice.ScoringService,
                    useValue: mockScoringService
                }
            ]
        }).compile();
        controller = module.get(_scoringcontroller.ScoringController);
        service = module.get(_scoringservice.ScoringService);
    });
    describe('getScoringResultsByScoringId', ()=>{
        it('should return an array of scoring results', async ()=>{
            const scoringID = '12345';
            const result = [];
            mockScoringService.getScoringResults.mockResolvedValue(result);
            const response = await controller.getScoringResultsByScoringId(scoringID);
            expect(response).toEqual(result);
        });
    });
});
