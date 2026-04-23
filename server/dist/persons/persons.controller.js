"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PersonsController", {
    enumerable: true,
    get: function() {
        return PersonsController;
    }
});
const _common = require("@nestjs/common");
const _personsservice = require("./persons.service");
const _personsfilterdto = require("./dto/persons.filter.dto");
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
let PersonsController = class PersonsController {
    postPerson(org, body) {
        body.organisation = org;
        return this.personService.create(body);
    }
    getPersons(org, filters) {
        filters.organisation = org;
        return this.personService.getMany(filters);
    }
    getPerson(org, id, filters) {
        return this.personService.getOne({
            id,
            org: org
        }, this.personService.servicesActivitiesInclude());
    }
    getPersonsFilter(org, body) {
        const types = Array.isArray(body) ? body : [
            body
        ];
        return this.personService.getCustomizedMany({
            OR: types.map((type)=>({
                    type
                }))
        });
    }
    constructor(personService){
        this.personService = personService;
    }
};
_ts_decorate([
    (0, _common.Post)(':org/persons'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        void 0
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], PersonsController.prototype, "postPerson", null);
_ts_decorate([
    (0, _common.Get)(':org/persons'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _personsfilterdto.PersonsFilter === "undefined" ? Object : _personsfilterdto.PersonsFilter
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], PersonsController.prototype, "getPersons", null);
_ts_decorate([
    (0, _common.Get)(':org/persons/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_param(2, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        typeof _personsfilterdto.PersonsFilter === "undefined" ? Object : _personsfilterdto.PersonsFilter
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], PersonsController.prototype, "getPerson", null);
_ts_decorate([
    (0, _common.Post)(':org/personsFilterByType'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        void 0
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], PersonsController.prototype, "getPersonsFilter", null);
PersonsController = _ts_decorate([
    (0, _common.Controller)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _personsservice.PersonsService === "undefined" ? Object : _personsservice.PersonsService
    ])
], PersonsController);
