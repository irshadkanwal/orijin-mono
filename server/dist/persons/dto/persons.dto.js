"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    PersonsDto: function() {
        return PersonsDto;
    },
    PersonsDtoConnected: function() {
        return PersonsDtoConnected;
    },
    PersonsDtoCsv: function() {
        return PersonsDtoCsv;
    }
});
const _classvalidator = require("class-validator");
const _usermodel = require("../../users/models/user.model");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AbstractDto = class AbstractDto {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], AbstractDto.prototype, "organisation", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", Object)
], AbstractDto.prototype, "shortCode", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], AbstractDto.prototype, "firstName", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], AbstractDto.prototype, "lastName", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", typeof _usermodel.UserType === "undefined" ? Object : _usermodel.UserType)
], AbstractDto.prototype, "type", void 0);
let PersonsDtoCsv = class PersonsDtoCsv extends AbstractDto {
};
let PersonsDto = class PersonsDto extends AbstractDto {
};
let PersonsDtoConnected = class PersonsDtoConnected extends PersonsDto {
};
