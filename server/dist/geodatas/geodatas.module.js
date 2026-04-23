"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GeodatasModule", {
    enumerable: true,
    get: function() {
        return GeodatasModule;
    }
});
const _common = require("@nestjs/common");
const _geopolygonservice = require("./geopolygon.service");
const _geodatascontroller = require("./geodatas.controller");
const _geopolygonwarningsservice = require("./geopolygonwarnings.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let GeodatasModule = class GeodatasModule {
};
GeodatasModule = _ts_decorate([
    (0, _common.Module)({
        imports: [],
        controllers: [
            _geodatascontroller.GeodatasController
        ],
        providers: [
            _geopolygonservice.PolygonService,
            _geopolygonwarningsservice.PolygonWarningService
        ],
        exports: [
            _geopolygonservice.PolygonService,
            _geopolygonwarningsservice.PolygonWarningService
        ]
    })
], GeodatasModule);
