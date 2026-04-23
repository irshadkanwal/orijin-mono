"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthResolver", {
    enumerable: true,
    get: function() {
        return AuthResolver;
    }
});
const _graphql = require("@nestjs/graphql");
const _authservice = require("./auth.service");
const _authmodel = require("./models/auth.model");
const _tokenmodel = require("./models/token.model");
const _logininput = require("./dto/login.input");
const _signupinput = require("./dto/signup.input");
const _refreshtokeninput = require("./dto/refresh-token.input");
const _usermodel = require("../users/models/user.model");
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
let AuthResolver = class AuthResolver {
    async signup(data) {
        data.email = data.email.toLowerCase();
        const { accessToken, refreshToken } = await this.auth.createUser(data);
        return {
            accessToken,
            refreshToken
        };
    }
    async login({ email, password }) {
        const { accessToken, refreshToken } = await this.auth.login(email.toLowerCase(), password);
        return {
            accessToken,
            refreshToken
        };
    }
    async refreshToken({ token }) {
        return this.auth.refreshToken(token);
    }
    async user(auth) {
        return await this.auth.getUserFromToken(auth.accessToken);
    }
    constructor(auth){
        this.auth = auth;
    }
};
_ts_decorate([
    (0, _graphql.Mutation)(()=>_authmodel.Auth),
    _ts_param(0, (0, _graphql.Args)('data')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _signupinput.SignupInput === "undefined" ? Object : _signupinput.SignupInput
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthResolver.prototype, "signup", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_authmodel.Auth),
    _ts_param(0, (0, _graphql.Args)('data')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _logininput.LoginInput === "undefined" ? Object : _logininput.LoginInput
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthResolver.prototype, "login", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_tokenmodel.Token),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _refreshtokeninput.RefreshTokenInput === "undefined" ? Object : _refreshtokeninput.RefreshTokenInput
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthResolver.prototype, "refreshToken", null);
_ts_decorate([
    (0, _graphql.ResolveField)('user', ()=>_usermodel.User),
    _ts_param(0, (0, _graphql.Parent)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _authmodel.Auth === "undefined" ? Object : _authmodel.Auth
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthResolver.prototype, "user", null);
AuthResolver = _ts_decorate([
    (0, _graphql.Resolver)(()=>_authmodel.Auth),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _authservice.AuthService === "undefined" ? Object : _authservice.AuthService
    ])
], AuthResolver);
