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
    PostOrder: function() {
        return PostOrder;
    },
    PostOrderField: function() {
        return PostOrderField;
    }
});
const _graphql = require("@nestjs/graphql");
const _order = require("../../common/order/order");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
var PostOrderField;
(function(PostOrderField) {
    PostOrderField["id"] = "id";
    PostOrderField["createdAt"] = "createdAt";
    PostOrderField["updatedAt"] = "updatedAt";
    PostOrderField["published"] = "published";
    PostOrderField["title"] = "title";
    PostOrderField["content"] = "content";
})(PostOrderField || (PostOrderField = {}));
(0, _graphql.registerEnumType)(PostOrderField, {
    name: 'PostOrderField',
    description: 'Properties by which post connections can be ordered.'
});
let PostOrder = class PostOrder extends _order.Order {
};
_ts_decorate([
    (0, _graphql.Field)(()=>PostOrderField),
    _ts_metadata("design:type", String)
], PostOrder.prototype, "field", void 0);
PostOrder = _ts_decorate([
    (0, _graphql.InputType)()
], PostOrder);
