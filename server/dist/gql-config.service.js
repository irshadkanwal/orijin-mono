"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GqlConfigService", {
    enumerable: true,
    get: function() {
        return GqlConfigService;
    }
});
const _config = require("@nestjs/config");
const _common = require("@nestjs/common");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let GqlConfigService = class GqlConfigService {
    createGqlOptions() {
        const graphqlConfig = this.configService.get('graphql');
        return {
            // schema options
            autoSchemaFile: graphqlConfig.schemaDestination || './src/schema.graphql',
            sortSchema: graphqlConfig.sortSchema,
            buildSchemaOptions: {
                numberScalarMode: 'integer'
            },
            // subscription
            installSubscriptionHandlers: true,
            includeStacktraceInErrorResponses: graphqlConfig.debug,
            playground: graphqlConfig.playgroundEnabled,
            context: ({ req })=>({
                    req
                })
        };
    }
    constructor(configService){
        this.configService = configService;
    }
};
GqlConfigService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService
    ])
], GqlConfigService);
