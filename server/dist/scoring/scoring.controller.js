"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ScoringController", {
    enumerable: true,
    get: function() {
        return ScoringController;
    }
});
const _common = require("@nestjs/common");
const _scoringservice = require("./scoring.service");
const _scoringdto = require("./dto/scoring.dto");
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
let ScoringController = class ScoringController {
    async getScoringResultsByScoringId(id) {
        return this.scoringService.getScoringResults(id);
    }
    async runScoring(org, runScoring) {
        const { ruleIDs, farmID } = runScoring;
        return await this.scoringService.runScoring(org, ruleIDs, farmID);
    }
    constructor(scoringService){
        this.scoringService = scoringService;
    }
};
_ts_decorate([
    (0, _common.Get)('scoring/:id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], ScoringController.prototype, "getScoringResultsByScoringId", null);
_ts_decorate([
    (0, _common.Post)(':org/scoring'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _scoringdto.RunScoringDto === "undefined" ? Object : _scoringdto.RunScoringDto
    ]),
    _ts_metadata("design:returntype", Promise)
], ScoringController.prototype, "runScoring", null);
ScoringController = _ts_decorate([
    (0, _common.Controller)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _scoringservice.ScoringService === "undefined" ? Object : _scoringservice.ScoringService
    ])
], ScoringController);
