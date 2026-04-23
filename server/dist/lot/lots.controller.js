"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LotsController", {
    enumerable: true,
    get: function() {
        return LotsController;
    }
});
const _common = require("@nestjs/common");
const _lotsservice = require("./lots.service");
const _paginationAndSortingdto = require("../common/dto/paginationAndSorting.dto");
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
let LotsController = class LotsController {
    getLots(org, filters) {
        filters.organisation = org;
        return this.lotService.getMany(filters);
    }
    getLot(org, id) {
        return this.lotService.getOne({
            id,
            org: org
        });
    }
    constructor(lotService){
        this.lotService = lotService;
    }
};
_ts_decorate([
    (0, _common.Get)(':org/lots'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _paginationAndSortingdto.StandardFilterDto === "undefined" ? Object : _paginationAndSortingdto.StandardFilterDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], LotsController.prototype, "getLots", null);
_ts_decorate([
    (0, _common.Get)(':org/lots/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], LotsController.prototype, "getLot", null);
LotsController = _ts_decorate([
    (0, _common.Controller)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _lotsservice.LotsService === "undefined" ? Object : _lotsservice.LotsService
    ])
], LotsController);
