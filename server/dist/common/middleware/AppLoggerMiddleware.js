"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppLoggerMiddleware", {
    enumerable: true,
    get: function() {
        return AppLoggerMiddleware;
    }
});
const _common = require("@nestjs/common");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AppLoggerMiddleware = class AppLoggerMiddleware {
    use(request, response, next) {
        if (process.env.NO_LOG !== 'true') {
            const { ip, method, originalUrl: url } = request;
            const userAgent = request.get('user-agent') || '';
            response.on('close', ()=>{
                const { statusCode } = response;
                const contentLength = response.get('content-length');
                const message = `${method} ${url} ${statusCode} ${contentLength}`; //- IP: ${ip}- ${userAgent}`;
                if (statusCode === 200 || statusCode === 304) {
                    this.logger.log(message);
                    if (this.logPayload(request)) {
                        this.logger.log(this.sanitizePayload(request.body));
                    }
                } else {
                    // Warn about other codes - note: The exception-handler.ts should fire as well which prints out the actual error
                    this.logger.warn(message);
                    if (this.logPayload(request)) {
                        this.logger.warn(this.sanitizePayload(request.body));
                    }
                }
            });
        }
        next();
    }
    constructor(){
        this.logger = new _common.Logger('AppLoggerMiddleware');
        // eslint-disable-next-line class-methods-use-this
        this.logPayload = (request)=>request.body && (request.method === 'POST' || request.method === 'PUT');
        this.sanitizePayload = (rawBody)=>{
            if (!rawBody) {
                return '';
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            if (rawBody.password) {
                rawBody.password = '== SANITIZED == ';
            }
            if (rawBody.oldPassword) {
                rawBody.oldPassword = '== SANITIZED == ';
            }
            return JSON.stringify(rawBody, null, 4);
        };
    }
};
AppLoggerMiddleware = _ts_decorate([
    (0, _common.Injectable)()
], AppLoggerMiddleware);
