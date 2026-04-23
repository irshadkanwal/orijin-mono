"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _nestjsprisma = require("nestjs-prisma");
const _config = require("@nestjs/config");
const _passwordservice = require("./password.service");
describe('PasswordService', ()=>{
    let service;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _passwordservice.PasswordService,
                _nestjsprisma.PrismaService,
                _config.ConfigService
            ]
        }).compile();
        service = module.get(_passwordservice.PasswordService);
    });
    it('should be defined', ()=>{
        expect(service).toBeDefined();
    });
});
