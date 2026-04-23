"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthService", {
    enumerable: true,
    get: function() {
        return AuthService;
    }
});
const _nestjsprisma = require("nestjs-prisma");
const _client = require("@prisma/client");
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _jwt = require("@nestjs/jwt");
const _passwordservice = require("./password.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AuthService = class AuthService {
    async createUser(payload) {
        const hashedPassword = await this.passwordService.hashPassword(payload.password);
        try {
            const user = await this.prisma.user.create({
                data: {
                    ...payload,
                    password: hashedPassword,
                    role: 'USER'
                }
            });
            return this.generateTokens({
                userId: user.id
            });
        } catch (e) {
            if (e instanceof _client.Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
                throw new _common.ConflictException(`Email ${payload.email} already used.`);
            }
            throw new Error(e);
        }
    }
    async login(email, password) {
        const user = await this.prisma.user.findUnique({
            where: {
                email
            }
        });
        if (!user) {
            throw new _common.NotFoundException(`No user found for email: ${email}`);
        }
        const passwordValid = await this.passwordService.validatePassword(password, user.password);
        if (!passwordValid) {
            throw new _common.BadRequestException('Invalid password');
        }
        return this.generateTokens({
            userId: user.id
        });
    }
    validateUser(userId) {
        return this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
    }
    getUserFromToken(token) {
        const id = this.jwtService.decode(token)['userId'];
        return this.prisma.user.findUnique({
            where: {
                id
            }
        });
    }
    generateTokens(payload) {
        return {
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload)
        };
    }
    generateAccessToken(payload) {
        return this.jwtService.sign(payload);
    }
    generateRefreshToken(payload) {
        const securityConfig = this.configService.get('security');
        return this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: securityConfig.refreshIn
        });
    }
    refreshToken(token) {
        try {
            const { userId } = this.jwtService.verify(token, {
                secret: this.configService.get('JWT_REFRESH_SECRET')
            });
            return this.generateTokens({
                userId
            });
        } catch (e) {
            throw new _common.UnauthorizedException();
        }
    }
    constructor(jwtService, prisma, passwordService, configService){
        this.jwtService = jwtService;
        this.prisma = prisma;
        this.passwordService = passwordService;
        this.configService = configService;
    }
};
AuthService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _jwt.JwtService === "undefined" ? Object : _jwt.JwtService,
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService,
        typeof _passwordservice.PasswordService === "undefined" ? Object : _passwordservice.PasswordService,
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService
    ])
], AuthService);
