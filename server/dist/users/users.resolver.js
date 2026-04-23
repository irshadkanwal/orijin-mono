"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsersResolver", {
    enumerable: true,
    get: function() {
        return UsersResolver;
    }
});
const _nestjsprisma = require("nestjs-prisma");
const _graphql = require("@nestjs/graphql");
const _common = require("@nestjs/common");
const _userdecorator = require("../common/decorators/user.decorator");
const _gqlauthguard = require("../auth/gql-auth.guard");
const _usersservice = require("./users.service");
const _usermodel = require("./models/user.model");
const _changepasswordinput = require("./dto/change-password.input");
const _updateuserinput = require("./dto/update-user.input");
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
let UsersResolver = class UsersResolver {
    async me(user) {
        return user;
    }
    async updateUser(user, newUserData) {
        return this.usersService.updateUser(user.id, newUserData);
    }
    async changePassword(user, changePassword) {
        return this.usersService.changePassword(user.id, user.password, changePassword);
    }
    posts(author) {
        return this.prisma.user.findUnique({
            where: {
                id: author.id
            }
        }).posts();
    }
    constructor(usersService, prisma){
        this.usersService = usersService;
        this.prisma = prisma;
    }
};
_ts_decorate([
    (0, _graphql.Query)(()=>_usermodel.User),
    _ts_param(0, (0, _userdecorator.UserEntity)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _usermodel.User === "undefined" ? Object : _usermodel.User
    ]),
    _ts_metadata("design:returntype", Promise)
], UsersResolver.prototype, "me", null);
_ts_decorate([
    (0, _common.UseGuards)(_gqlauthguard.GqlAuthGuard),
    (0, _graphql.Mutation)(()=>_usermodel.User),
    _ts_param(0, (0, _userdecorator.UserEntity)()),
    _ts_param(1, (0, _graphql.Args)('data')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _usermodel.User === "undefined" ? Object : _usermodel.User,
        typeof _updateuserinput.UpdateUserInput === "undefined" ? Object : _updateuserinput.UpdateUserInput
    ]),
    _ts_metadata("design:returntype", Promise)
], UsersResolver.prototype, "updateUser", null);
_ts_decorate([
    (0, _common.UseGuards)(_gqlauthguard.GqlAuthGuard),
    (0, _graphql.Mutation)(()=>_usermodel.User),
    _ts_param(0, (0, _userdecorator.UserEntity)()),
    _ts_param(1, (0, _graphql.Args)('data')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _usermodel.User === "undefined" ? Object : _usermodel.User,
        typeof _changepasswordinput.ChangePasswordInput === "undefined" ? Object : _changepasswordinput.ChangePasswordInput
    ]),
    _ts_metadata("design:returntype", Promise)
], UsersResolver.prototype, "changePassword", null);
_ts_decorate([
    (0, _graphql.ResolveField)('posts'),
    _ts_param(0, (0, _graphql.Parent)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _usermodel.User === "undefined" ? Object : _usermodel.User
    ]),
    _ts_metadata("design:returntype", void 0)
], UsersResolver.prototype, "posts", null);
UsersResolver = _ts_decorate([
    (0, _graphql.Resolver)(()=>_usermodel.User),
    (0, _common.UseGuards)(_gqlauthguard.GqlAuthGuard),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _usersservice.UsersService === "undefined" ? Object : _usersservice.UsersService,
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService
    ])
], UsersResolver);
