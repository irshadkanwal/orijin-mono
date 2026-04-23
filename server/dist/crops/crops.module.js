"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CropsModule", {
    enumerable: true,
    get: function() {
        return CropsModule;
    }
});
const _common = require("@nestjs/common");
const _cropvarietyservice = require("./cropvariety.service");
const _cropsservice = require("./crops.service");
const _cropscontroller = require("./crops.controller");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let CropsModule = class CropsModule {
};
CropsModule = _ts_decorate([
    (0, _common.Module)({
        imports: [],
        controllers: [
            _cropscontroller.CropsController
        ],
        providers: [
            _cropvarietyservice.CropvarietyService,
            _cropsservice.CropsService
        ],
        exports: [
            _cropvarietyservice.CropvarietyService,
            _cropsservice.CropsService
        ]
    })
], CropsModule);
