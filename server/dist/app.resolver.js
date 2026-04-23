"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppResolver", {
    enumerable: true,
    get: function() {
        return AppResolver;
    }
});
const _graphql = require("@nestjs/graphql");
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
let AppResolver = class AppResolver {
    helloWorld() {
        return 'Hello World!';
    }
    hello(name) {
        return `Hello ${name}!`;
    }
};
_ts_decorate([
    (0, _graphql.Query)(()=>String),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", String)
], AppResolver.prototype, "helloWorld", null);
_ts_decorate([
    (0, _graphql.Query)(()=>String),
    _ts_param(0, (0, _graphql.Args)('name')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", String)
], AppResolver.prototype, "hello", null);
AppResolver = _ts_decorate([
    (0, _graphql.Resolver)()
], AppResolver);
