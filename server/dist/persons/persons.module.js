"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PersonsModule", {
    enumerable: true,
    get: function() {
        return PersonsModule;
    }
});
const _common = require("@nestjs/common");
const _personsservice = require("./persons.service");
const _personscontroller = require("./persons.controller");
const _changesmodule = require("../changes/changes.module");
const _contactsservice = require("./contacts.service");
const _walletsservice = require("./wallets.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let PersonsModule = class PersonsModule {
};
PersonsModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _changesmodule.ChangesModule
        ],
        controllers: [
            _personscontroller.PersonsController
        ],
        providers: [
            _personsservice.PersonsService,
            _contactsservice.ContactsService,
            _walletsservice.WalletsService
        ],
        exports: [
            _personsservice.PersonsService,
            _contactsservice.ContactsService,
            _walletsservice.WalletsService
        ]
    })
], PersonsModule);
