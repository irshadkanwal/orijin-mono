"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppModuleForScripts", {
    enumerable: true,
    get: function() {
        return AppModuleForScripts;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _nestjsprisma = require("nestjs-prisma");
const _config1 = /*#__PURE__*/ _interop_require_default(require("../common/configs/config"));
const _authmodule = require("../auth/auth.module");
const _usersmodule = require("../users/users.module");
const _postsmodule = require("../posts/posts.module");
const _supportServicemodule = require("../supportServices/supportService.module");
const _geodatasmodule = require("../geodatas/geodatas.module");
const _organisationsmodule = require("../organisations/organisations.module");
const _tagsmodule = require("../tags/tags.module");
const _certificationsmodule = require("../certifications/certifications.module");
const _locationsmodule = require("../locations/locations.module");
const _farmsmodule = require("../farms/farms.module");
const _personsmodule = require("../persons/persons.module");
const _facilitiesmodule = require("../facilities/facilities.module");
const _cropsmodule = require("../crops/crops.module");
const _firestoremodule = require("../firestore/firestore.module");
const _appcontroller = require("../app.controller");
const _appservice = require("../app.service");
const _appresolver = require("../app.resolver");
const _geocledianmodule = require("../geocledian/geocledian.module");
const _dataImportsmodule = require("../dataImports/dataImports.module");
const _polygonUtilmodule = require("../polygonUtil/polygonUtil.module");
const _lotsmodule = require("../lot/lots.module");
const _paymentTransactionmodule = require("../paymentTransaction/paymentTransaction.module");
const _vesselsmodule = require("../vessels/vessels.module");
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
let AppModuleForScripts = class AppModuleForScripts {
};
AppModuleForScripts = _ts_decorate([
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
            _authmodule.AuthModule,
            _usersmodule.UsersModule,
            _postsmodule.PostsModule,
            _supportServicemodule.SupportServiceModule,
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
            _cropsmodule.CropsModule,
            _vesselsmodule.VesselsModule,
            _firestoremodule.FirestoreModule,
            _geocledianmodule.GeocledianModule,
            _dataImportsmodule.DataImportsModule,
            _polygonUtilmodule.PolygonUtilModule
        ],
        controllers: [
            _appcontroller.AppController
        ],
        providers: [
            _appservice.AppService,
            _appresolver.AppResolver
        ]
    })
], AppModuleForScripts);
