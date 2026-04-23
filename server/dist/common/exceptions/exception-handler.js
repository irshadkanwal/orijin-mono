"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ExceptionHandler", {
    enumerable: true,
    get: function() {
        return ExceptionHandler;
    }
});
const _common = require("@nestjs/common");
const _client = require("@prisma/client");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ExceptionHandler = class ExceptionHandler {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const statusCode = exception instanceof _common.HttpException ? exception.getStatus() : _common.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal Server Error';
        // https://www.prisma.io/docs/orm/reference/error-reference
        if (exception instanceof _client.Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (exception.code === 'P2002') {
                message = 'Unique constraint violation at ' + exception.meta.modelName + '.' + exception.meta.target[0]; // TODO: Handle cases with more than 1 error..
            } else {
                message = ' NEW ERROR';
            }
        } else if (exception instanceof _client.Prisma.PrismaClientValidationError) {
            // Issues with Prisma schema usually, no need to communicate to client but needs
            // full print of stacktrace here to see what's wrong
            this.logger.error(exception);
        } else {
            message = exception.response?.message || exception.message || exception;
        }
        // TODO: Define which errors are useful to log, and which not (standard validation errors not, but actual errors yes)
        if (statusCode === 401 || statusCode === 403 || statusCode === 404) {
            this.logger.warn(JSON.stringify(message, null, 4));
        } else {
            this.logger.error(`Error ${statusCode}: ${JSON.stringify(message, null, 4)}`);
            this.logger.error(exception.stack);
        }
        response.status(statusCode).json({
            error: {
                timestamp: new Date().toISOString(),
                path: request.url,
                code: statusCode,
                message
            }
        });
    }
    constructor(){
        this.logger = new _common.Logger('ExceptionHandler');
    }
};
ExceptionHandler = _ts_decorate([
    (0, _common.Catch)()
], ExceptionHandler);
