"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OrganisationsModule", {
    enumerable: true,
    get: function() {
        return OrganisationsModule;
    }
});
const _common = require("@nestjs/common");
const _organisationsservice = require("./organisations.service");
const _organisationscontroller = require("./organisations.controller");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let OrganisationsModule = class OrganisationsModule {
};
OrganisationsModule = _ts_decorate([
    (0, _common.Module)({
        imports: [],
        controllers: [
            _organisationscontroller.OrganisationsController
        ],
        providers: [
            _organisationsservice.OrganisationsService
        ]
    })
], OrganisationsModule);
