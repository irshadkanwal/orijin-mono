"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ExternalSchedulerController", {
    enumerable: true,
    get: function() {
        return ExternalSchedulerController;
    }
});
const _common = require("@nestjs/common");
const _constants = require("../common/constants");
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
let ExternalSchedulerController = class ExternalSchedulerController {
    async runScheduler(payload, req) {
        this.logger.log('Scheduler called with payload: ' + JSON.stringify(payload, null, 4));
        this.logger.log('Scheduler raw body', req.rawBody);
        return true;
    }
    constructor(){
        this.logger = new _common.Logger(ExternalSchedulerController.name);
    }
};
_ts_decorate([
    (0, _common.Post)(_constants.EXTERNAL_SCHEDULER_URL),
    (0, _common.Header)('content-type', 'application/octet-stream'),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0,
        typeof _common.RawBodyRequest === "undefined" ? Object : _common.RawBodyRequest
    ]),
    _ts_metadata("design:returntype", Promise)
], ExternalSchedulerController.prototype, "runScheduler", null);
ExternalSchedulerController = _ts_decorate([
    (0, _common.Controller)()
], ExternalSchedulerController);
