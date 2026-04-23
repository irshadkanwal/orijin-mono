"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SupportServiceModule", {
    enumerable: true,
    get: function() {
        return SupportServiceModule;
    }
});
const _common = require("@nestjs/common");
const _supportServiceCategoryservice = require("./supportServiceCategory.service");
const _supportServicecontroller = require("./supportService.controller");
const _supportServiceActivityservice = require("./supportServiceActivity.service");
const _supportServiceCategoryTypeservice = require("./supportServiceCategoryType.service");
const _supportServiceActivityTypeservice = require("./supportServiceActivityType.service");
const _supportServiceInputTypeservice = require("./supportServiceInputType.service");
const _supportServiceActivityBeneficiaryservice = require("./supportServiceActivityBeneficiary.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let SupportServiceModule = class SupportServiceModule {
};
SupportServiceModule = _ts_decorate([
    (0, _common.Module)({
        imports: [],
        controllers: [
            _supportServicecontroller.SupportServiceController
        ],
        providers: [
            _supportServiceCategoryTypeservice.SupportServiceCategoryTypeService,
            _supportServiceCategoryservice.SupportServiceCategoryService,
            _supportServiceActivityservice.SupportServiceActivityService,
            _supportServiceActivityTypeservice.SupportServiceActivityTypeService,
            _supportServiceInputTypeservice.SupportServiceInputTypeService,
            _supportServiceActivityBeneficiaryservice.SupportServiceActivityBeneficiaryService
        ],
        exports: [
            _supportServiceCategoryTypeservice.SupportServiceCategoryTypeService,
            _supportServiceCategoryservice.SupportServiceCategoryService,
            _supportServiceActivityservice.SupportServiceActivityService,
            _supportServiceActivityTypeservice.SupportServiceActivityTypeService,
            _supportServiceInputTypeservice.SupportServiceInputTypeService,
            _supportServiceActivityBeneficiaryservice.SupportServiceActivityBeneficiaryService
        ]
    })
], SupportServiceModule);
