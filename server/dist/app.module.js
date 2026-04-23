"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppModule", {
    enumerable: true,
    get: function() {
        return AppModule;
    }
});
const _graphql = require("@nestjs/graphql");
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _nestjsprisma = require("nestjs-prisma");
const _appcontroller = require("./app.controller");
const _appservice = require("./app.service");
const _appresolver = require("./app.resolver");
const _authmodule = require("./auth/auth.module");
const _usersmodule = require("./users/users.module");
const _postsmodule = require("./posts/posts.module");
const _config1 = /*#__PURE__*/ _interop_require_default(require("./common/configs/config"));
const _apollo = require("@nestjs/apollo");
const _gqlconfigservice = require("./gql-config.service");
const _supportServicemodule = require("./supportServices/supportService.module");
const _cropsmodule = require("./crops/crops.module");
const _geodatasmodule = require("./geodatas/geodatas.module");
const _personsmodule = require("./persons/persons.module");
const _facilitiesmodule = require("./facilities/facilities.module");
const _organisationsmodule = require("./organisations/organisations.module");
const _tagsmodule = require("./tags/tags.module");
const _AppLoggerMiddleware = require("./common/middleware/AppLoggerMiddleware");
const _firestoremodule = require("./firestore/firestore.module");
const _certificationsmodule = require("./certifications/certifications.module");
const _locationsmodule = require("./locations/locations.module");
const _farmsmodule = require("./farms/farms.module");
const _FirebaseAuthMiddleware = require("./common/middleware/FirebaseAuthMiddleware");
const _FirebaseAuthAdminMiddleware = require("./common/middleware/FirebaseAuthAdminMiddleware");
const _polygonUtilmodule = require("./polygonUtil/polygonUtil.module");
const _sendgridservice = require("./common/service/send-grid/send-grid.service");
const _filtersmodule = require("./filters/filters.module");
const _scoringmodule = require("./scoring/scoring.module");
const _rulemodule = require("./rule/rule.module");
const _externalSchedulermodule = require("./externalScheduler/externalScheduler.module");
const _constants = require("./common/constants");
const _GoogleCloudAuthMiddleware = require("./common/middleware/GoogleCloudAuthMiddleware");
const _geocledianmodule = require("./geocledian/geocledian.module");
const _changesmodule = require("./changes/changes.module");
const _dataImportsmodule = require("./dataImports/dataImports.module");
const _lotsmodule = require("./lot/lots.module");
const _paymentTransactionmodule = require("./paymentTransaction/paymentTransaction.module");
const _vesselsmodule = require("./vessels/vessels.module");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AppModule = class AppModule {
    // TODO: Rewrite these as Guards and apply in Controllers, rather than doing out of sight here
    configure(consumer) {
        consumer.apply(_AppLoggerMiddleware.AppLoggerMiddleware).forRoutes('*');
        consumer.apply(_FirebaseAuthMiddleware.FirebaseAuthMiddleware).exclude(_constants.EXTERNAL_SCHEDULER_URL, _constants.FARM_INSPECTION_URL).forRoutes('*');
        consumer.apply(_GoogleCloudAuthMiddleware.GoogleCloudAuthMiddleware) //
        .forRoutes(_constants.EXTERNAL_SCHEDULER_URL);
        consumer.apply(_FirebaseAuthAdminMiddleware.FirebaseAuthAdminMiddleware).forRoutes({
            path: 'users',
            method: _common.RequestMethod.ALL
        }, {
            path: 'user',
            method: _common.RequestMethod.ALL
        }, {
            path: 'reset-password',
            method: _common.RequestMethod.POST
        });
    }
};
AppModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _config.ConfigModule.forRoot({
                // ====
                // WARN about "envFilePath": as Prisma's CLI commands depend on the .env file, it's better to use the Dotenv CLI to change files from outside
                // rather than rely on changing inside NestJS. See package.json "test:e2e:local" for reference
                // ====
                isGlobal: true,
                load: [
                    _config1.default
                ]
            }),
            _nestjsprisma.PrismaModule.forRoot({
                isGlobal: true,
                prismaServiceOptions: {
                    middlewares: []
                }
            }),
            _graphql.GraphQLModule.forRootAsync({
                driver: _apollo.ApolloDriver,
                useClass: _gqlconfigservice.GqlConfigService
            }),
            _authmodule.AuthModule,
            _usersmodule.UsersModule,
            _postsmodule.PostsModule,
            _supportServicemodule.SupportServiceModule,
            _filtersmodule.FiltersModule,
            _geodatasmodule.GeodatasModule,
            _organisationsmodule.OrganisationsModule,
            _tagsmodule.TagsModule,
            _certificationsmodule.CertificationsModule,
            _locationsmodule.LocationsModule,
            _farmsmodule.FarmsModule,
            _personsmodule.PersonsModule,
            _lotsmodule.LotsModule,
            _paymentTransactionmodule.PaymentTransactionsModule,
            _facilitiesmodule.FacilitiesModule,
            _changesmodule.ChangesModule,
            _cropsmodule.CropsModule,
            _vesselsmodule.VesselsModule,
            _firestoremodule.FirestoreModule,
            _polygonUtilmodule.PolygonUtilModule,
            _scoringmodule.ScoringModule,
            _rulemodule.RuleModule,
            _externalSchedulermodule.ExternalSchedulerModule,
            _geocledianmodule.GeocledianModule,
            _dataImportsmodule.DataImportsModule
        ],
        controllers: [
            _appcontroller.AppController
        ],
        providers: [
            _appservice.AppService,
            _appresolver.AppResolver,
            _nestjsprisma.PrismaService,
            _sendgridservice.SendGridService
        ],
        exports: [
            _nestjsprisma.PrismaService
        ]
    })
], AppModule);
