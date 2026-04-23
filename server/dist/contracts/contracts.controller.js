"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ContractsController", {
    enumerable: true,
    get: function() {
        return ContractsController;
    }
});
const _common = require("@nestjs/common");
const _contractsservice = require("./contracts.service");
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
let ContractsController = class ContractsController {
    postContract(body) {
        return this.contactService.create(body);
    }
    getVarieties() {
        return this.contactService.getAll();
    }
    getContract(id) {
        return this.contactService.getOne(id);
    }
    constructor(contactService){
        this.contactService = contactService;
    }
};
_ts_decorate([
    (0, _common.Post)('contacts'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], ContractsController.prototype, "postContract", null);
_ts_decorate([
    (0, _common.Get)('contacts'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], ContractsController.prototype, "getVarieties", null);
_ts_decorate([
    (0, _common.Get)('contacts/:id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], ContractsController.prototype, "getContract", null);
ContractsController = _ts_decorate([
    (0, _common.Controller)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _contractsservice.ContractsService === "undefined" ? Object : _contractsservice.ContractsService
    ])
], ContractsController);
