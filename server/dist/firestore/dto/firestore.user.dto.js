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
    FireStoreCreateUserDto: function() {
        return FireStoreCreateUserDto;
    },
    FireStoreDeleteUsersDto: function() {
        return FireStoreDeleteUsersDto;
    },
    FireStoreUpdateUserDto: function() {
        return FireStoreUpdateUserDto;
    },
    ReferenceIdDto: function() {
        return ReferenceIdDto;
    }
});
const _classvalidator = require("class-validator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ReferenceIdDto = class ReferenceIdDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], ReferenceIdDto.prototype, "id", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], ReferenceIdDto.prototype, "refCollection", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", Boolean)
], ReferenceIdDto.prototype, "isPreviousVersion", void 0);
let FireStoreCreateUserDto = class FireStoreCreateUserDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], FireStoreCreateUserDto.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], FireStoreCreateUserDto.prototype, "email", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], FireStoreCreateUserDto.prototype, "password", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], FireStoreCreateUserDto.prototype, "role", void 0);
let FireStoreUpdateUserDto = class FireStoreUpdateUserDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], FireStoreUpdateUserDto.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], FireStoreUpdateUserDto.prototype, "email", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], FireStoreUpdateUserDto.prototype, "role", void 0);
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Array)
], FireStoreUpdateUserDto.prototype, "ids", void 0);
let FireStoreDeleteUsersDto = class FireStoreDeleteUsersDto {
};
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", Array)
], FireStoreDeleteUsersDto.prototype, "ids", void 0);
