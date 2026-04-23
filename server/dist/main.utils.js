"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    applyCommonAppSettings: function() {
        return applyCommonAppSettings;
    },
    logStartup: function() {
        return logStartup;
    }
});
const _common = require("@nestjs/common");
const _validationpipe = require("./common/pipes/validation.pipe");
const _exceptionhandler = require("./common/exceptions/exception-handler");
const _express = require("express");
const _core = require("@nestjs/core");
const _nestjsprisma = require("nestjs-prisma");
const applyCommonAppSettings = (app)=>{
    // Validation
    app.useGlobalPipes((0, _validationpipe.getValidationPipeWithMessages)());
    app.useGlobalFilters(new _exceptionhandler.ExceptionHandler());
    // Damn that firebase..
    app.use((0, _express.json)({
        limit: '1mb'
    }));
    app.use((0, _express.urlencoded)({
        extended: true,
        limit: '1mb'
    }));
    // Prisma Client Exception Filter for unhandled exceptions
    const { httpAdapter } = app.get(_core.HttpAdapterHost);
    app.useGlobalFilters(new _nestjsprisma.PrismaClientExceptionFilter(httpAdapter));
};
const logStartup = ()=>{
    const logger = new _common.Logger('Bootstrap');
    const dbSplit = process.env.DATABASE_URL?.split('@');
    const dbUrl = dbSplit ? dbSplit[dbSplit.length - 1] // In case a @ exist in the password too
     : process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.POSTGRES_DB;
    logger.log('===============');
    logger.log('App started');
    logger.log(`PORT:         ${process.env.PORT}`);
    logger.log(`NODE_ENV:     ${process.env.NODE_ENV}`);
    logger.log(`DB:           ${dbUrl}`);
    logger.log(`FIRESTORE:    ${process.env.FIREBASE_PROJECT_ID || 'disabled'}`);
    logger.log(`SENDGRID:     ${process.env.SENDGRID_API_KEY || 'disabled'}`);
    logger.log('===============');
};
