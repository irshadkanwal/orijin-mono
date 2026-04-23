"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
require("source-map-support/register");
const _config = require("@nestjs/config");
const _core = require("@nestjs/core");
const _swagger = require("@nestjs/swagger");
const _appmodule = require("./app.module");
const _mainutils = require("./main.utils");
async function bootstrap() {
    const app = await _core.NestFactory.create(_appmodule.AppModule);
    (0, _mainutils.applyCommonAppSettings)(app);
    // enable shutdown hook
    app.enableShutdownHooks();
    const configService = app.get(_config.ConfigService);
    const nestConfig = configService.get('nest');
    const corsConfig = configService.get('cors');
    const swaggerConfig = configService.get('swagger');
    // Swagger Api
    if (swaggerConfig.enabled) {
        const options = new _swagger.DocumentBuilder().setTitle(swaggerConfig.title || 'Nestjs').setDescription(swaggerConfig.description || 'The nestjs API description').setVersion(swaggerConfig.version || '1.0').build();
        const document = _swagger.SwaggerModule.createDocument(app, options);
        _swagger.SwaggerModule.setup(swaggerConfig.path || 'api', app, document);
    }
    // Cors
    if (corsConfig.enabled) {
        app.enableCors();
    }
    await app.listen(process.env.PORT || nestConfig.port || 3000);
    (0, _mainutils.logStartup)();
}
bootstrap();
