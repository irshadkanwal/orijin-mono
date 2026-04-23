"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FiltersController", {
    enumerable: true,
    get: function() {
        return FiltersController;
    }
});
const _common = require("@nestjs/common");
const _filtersservice = require("./filters.service");
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
let FiltersController = class FiltersController {
    async getFilters(filterKey) {
        return this.filtersService.getFilters(filterKey);
    }
    getOrgFilters(filterKey, orgId) {
        return this.filtersService.getFilters(filterKey, orgId);
    }
    constructor(filtersService){
        this.filtersService = filtersService;
    }
};
_ts_decorate([
    (0, _common.Get)('filters/:filterKey'),
    _ts_param(0, (0, _common.Param)('filterKey')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], FiltersController.prototype, "getFilters", null);
_ts_decorate([
    (0, _common.Get)(':orgId/filters/:filterKey'),
    _ts_param(0, (0, _common.Param)('filterKey')),
    _ts_param(1, (0, _common.Param)('orgId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], FiltersController.prototype, "getOrgFilters", null);
FiltersController = _ts_decorate([
    (0, _common.Controller)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _filtersservice.FiltersService === "undefined" ? Object : _filtersservice.FiltersService
    ])
], FiltersController);
