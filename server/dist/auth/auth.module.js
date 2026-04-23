"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthModule", {
    enumerable: true,
    get: function() {
        return AuthModule;
    }
});
const _common = require("@nestjs/common");
const _jwt = require("@nestjs/jwt");
const _passport = require("@nestjs/passport");
const _config = require("@nestjs/config");
const _passwordservice = require("./password.service");
const _gqlauthguard = require("./gql-auth.guard");
const _authservice = require("./auth.service");
const _authresolver = require("./auth.resolver");
const _jwtstrategy = require("./jwt.strategy");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AuthModule = class AuthModule {
};
AuthModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _passport.PassportModule.register({
                defaultStrategy: 'jwt'
            }),
            _jwt.JwtModule.registerAsync({
                useFactory: async (configService)=>{
                    const securityConfig = configService.get('security');
                    return {
                        secret: configService.get('JWT_ACCESS_SECRET'),
                        signOptions: {
                            expiresIn: securityConfig.expiresIn
                        }
                    };
                },
                inject: [
                    _config.ConfigService
                ]
            })
        ],
        providers: [
            _authservice.AuthService,
            _authresolver.AuthResolver,
            _jwtstrategy.JwtStrategy,
            _gqlauthguard.GqlAuthGuard,
            _passwordservice.PasswordService
        ],
        exports: [
            _gqlauthguard.GqlAuthGuard
        ]
    })
], AuthModule);
