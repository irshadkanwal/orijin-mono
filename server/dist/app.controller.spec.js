"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _chance = require("chance");
const _appcontroller = require("./app.controller");
const _appservice = require("./app.service");
const chance = new _chance.Chance();
describe('AppController', ()=>{
    let appController;
    beforeEach(async ()=>{
        const app = await _testing.Test.createTestingModule({
            controllers: [
                _appcontroller.AppController
            ],
            providers: [
                _appservice.AppService
            ]
        }).compile();
        appController = app.get(_appcontroller.AppController);
    });
    describe('root', ()=>{
        it('should return "Hello World!"', ()=>{
            expect(appController.getHello()).toBe('Hello World!');
        });
    });
    describe('hello/:name', ()=>{
        it('should return "Hello ${name}!"', ()=>{
            const name = chance.name();
            expect(appController.getHelloName(name)).toBe(`Hello ${name}!`);
        });
    });
});
