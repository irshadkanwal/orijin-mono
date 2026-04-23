"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RuleFunctionsService", {
    enumerable: true,
    get: function() {
        return RuleFunctionsService;
    }
});
const _common = require("@nestjs/common");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let RuleFunctionsService = class RuleFunctionsService {
    //Main Function
    async isPolygonCorrect(farm) {
        return await this.farmPlotValid(farm);
    }
    isAreaValid(area) {
        return area >= this.MIN_AREA && area <= this.MAX_AREA;
    }
    async farmPlotValid(farm) {
        return this.isAreaValid(farm.totalArea);
    }
    constructor(){
        this.MIN_AREA = 0.1;
        this.MAX_AREA = 10;
    }
};
RuleFunctionsService = _ts_decorate([
    (0, _common.Injectable)({})
], RuleFunctionsService);
