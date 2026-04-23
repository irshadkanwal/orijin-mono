"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ChangePasswordInput", {
    enumerable: true,
    get: function() {
        return ChangePasswordInput;
    }
});
const _graphql = require("@nestjs/graphql");
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
let ChangePasswordInput = class ChangePasswordInput {
};
_ts_decorate([
    (0, _graphql.Field)(),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.MinLength)(8),
    _ts_metadata("design:type", String)
], ChangePasswordInput.prototype, "oldPassword", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.MinLength)(8),
    _ts_metadata("design:type", String)
], ChangePasswordInput.prototype, "newPassword", void 0);
ChangePasswordInput = _ts_decorate([
    (0, _graphql.InputType)()
], ChangePasswordInput);
