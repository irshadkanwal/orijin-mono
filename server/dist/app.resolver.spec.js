"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _chance = require("chance");
const _appresolver = require("./app.resolver");
const _appservice = require("./app.service");
const chance = new _chance.Chance();
describe('AppResolver', ()=>{
    let appResolver;
    beforeEach(async ()=>{
        const app = await _testing.Test.createTestingModule({
            providers: [
                _appresolver.AppResolver,
                _appservice.AppService
            ]
        }).compile();
        appResolver = app.get(_appresolver.AppResolver);
    });
    describe('helloWorld', ()=>{
        it('should return "Hello World!"', ()=>{
            expect(appResolver.helloWorld()).toBe('Hello World!');
        });
    });
    describe('hello', ()=>{
        it('should return "Hello ${name}!"', ()=>{
            const name = chance.name();
            expect(appResolver.hello(name)).toBe(`Hello ${name}!`);
        });
    });
});
