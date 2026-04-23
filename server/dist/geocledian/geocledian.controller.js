"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GeocledianController", {
    enumerable: true,
    get: function() {
        return GeocledianController;
    }
});
const _common = require("@nestjs/common");
const _geocledianservice = require("./geocledian.service");
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
let GeocledianController = class GeocledianController {
    // TODO: Convert to Post, perhaps, later..
    startSatelliteAnalysisForFarm(org, id) {
        // TODO: Confirm that the org is the same as the parent farm
        return this.geoCledainService.submitAnalysisRequest(id, org);
    }
    getRiskAnalysisResultForPlot(org, id) {
        // TODO: Confirm that the org is the same as the parent farm
        return this.geoCledainService.getAndStoreAnalysisResponse(id, org);
    }
    constructor(geoCledainService){
        this.geoCledainService = geoCledainService;
    }
};
_ts_decorate([
    (0, _common.Get)(':org/startAnalysis/farm/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], GeocledianController.prototype, "startSatelliteAnalysisForFarm", null);
_ts_decorate([
    (0, _common.Get)(':org/analysisResult/plot/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], GeocledianController.prototype, "getRiskAnalysisResultForPlot", null);
GeocledianController = _ts_decorate([
    (0, _common.Controller)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _geocledianservice.GeocledianService === "undefined" ? Object : _geocledianservice.GeocledianService
    ])
], GeocledianController);
