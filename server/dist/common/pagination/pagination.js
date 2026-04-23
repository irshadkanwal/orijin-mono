"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return Paginated;
    }
});
const _graphql = require("@nestjs/graphql");
const _pageinfomodel = require("./page-info.model");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function Paginated(TItemClass) {
    let EdgeType = class EdgeType {
    };
    _ts_decorate([
        (0, _graphql.Field)(()=>String),
        _ts_metadata("design:type", String)
    ], EdgeType.prototype, "cursor", void 0);
    _ts_decorate([
        (0, _graphql.Field)(()=>TItemClass),
        _ts_metadata("design:type", typeof TItem === "undefined" ? Object : TItem)
    ], EdgeType.prototype, "node", void 0);
    EdgeType = _ts_decorate([
        (0, _graphql.ObjectType)(`${TItemClass.name}Edge`)
    ], EdgeType);
    let PaginatedType = class PaginatedType {
    };
    _ts_decorate([
        (0, _graphql.Field)(()=>[
                EdgeType
            ], {
            nullable: true
        }),
        _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
    ], PaginatedType.prototype, "edges", void 0);
    _ts_decorate([
        (0, _graphql.Field)(()=>_pageinfomodel.PageInfo),
        _ts_metadata("design:type", typeof _pageinfomodel.PageInfo === "undefined" ? Object : _pageinfomodel.PageInfo)
    ], PaginatedType.prototype, "pageInfo", void 0);
    _ts_decorate([
        (0, _graphql.Field)(()=>_graphql.Int),
        _ts_metadata("design:type", Number)
    ], PaginatedType.prototype, "totalCount", void 0);
    PaginatedType = _ts_decorate([
        (0, _graphql.ObjectType)({
            isAbstract: true
        })
    ], PaginatedType);
    return PaginatedType;
}
