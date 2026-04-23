"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsersService", {
    enumerable: true,
    get: function() {
        return UsersService;
    }
});
const _nestjsprisma = require("nestjs-prisma");
const _common = require("@nestjs/common");
const _passwordservice = require("../auth/password.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let UsersService = class UsersService {
    updateUser(userId, newUserData) {
        return this.prisma.user.update({
            data: newUserData,
            where: {
                id: userId
            }
        });
    }
    async changePassword(userId, userPassword, changePassword) {
        const passwordValid = await this.passwordService.validatePassword(changePassword.oldPassword, userPassword);
        if (!passwordValid) {
            throw new _common.BadRequestException('Invalid password');
        }
        const hashedPassword = await this.passwordService.hashPassword(changePassword.newPassword);
        return this.prisma.user.update({
            data: {
                password: hashedPassword
            },
            where: {
                id: userId
            }
        });
    }
    constructor(prisma, passwordService){
        this.prisma = prisma;
        this.passwordService = passwordService;
    }
};
UsersService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService,
        typeof _passwordservice.PasswordService === "undefined" ? Object : _passwordservice.PasswordService
    ])
], UsersService);
