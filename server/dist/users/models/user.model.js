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
    Gender: function() {
        return Gender;
    },
    User: function() {
        return User;
    },
    UserType: function() {
        return UserType;
    }
});
require("reflect-metadata");
const _graphql = require("@nestjs/graphql");
const _classvalidator = require("class-validator");
const _postmodel = require("../../posts/models/post.model");
const _basegraphqlmodel = require("../../common/models/base.graphql.model");
const _client = require("@prisma/client");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
(0, _graphql.registerEnumType)(_client.Role, {
    name: 'Role',
    description: 'User role'
});
var Gender;
(function(Gender) {
    Gender["Male"] = "Male";
    Gender["Female"] = "Female";
    Gender["Other"] = "Other";
})(Gender || (Gender = {}));
var UserType;
(function(UserType) {
    UserType["Organisation"] = "Organisation";
    UserType["Farmer"] = "Farmer";
    UserType["Picker"] = "Picker";
    UserType["Officer"] = "Officer";
    UserType["FarmEmployee"] = "FarmEmployee";
    UserType["FactoryEmployee"] = "FactoryEmployee";
})(UserType || (UserType = {}));
let User = class User extends _basegraphqlmodel.BaseGraphqlModel {
};
_ts_decorate([
    (0, _graphql.Field)(),
    (0, _classvalidator.IsEmail)(),
    _ts_metadata("design:type", String)
], User.prototype, "email", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    _ts_metadata("design:type", String)
], User.prototype, "firstName", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    _ts_metadata("design:type", String)
], User.prototype, "lastName", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_client.Role),
    _ts_metadata("design:type", typeof _client.Role === "undefined" ? Object : _client.Role)
], User.prototype, "role", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>[
            _postmodel.Post
        ], {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], User.prototype, "posts", void 0);
_ts_decorate([
    (0, _graphql.HideField)(),
    _ts_metadata("design:type", String)
], User.prototype, "password", void 0);
User = _ts_decorate([
    (0, _graphql.ObjectType)()
], User);
