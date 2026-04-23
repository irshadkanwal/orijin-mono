"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Post", {
    enumerable: true,
    get: function() {
        return Post;
    }
});
const _graphql = require("@nestjs/graphql");
const _usermodel = require("../../users/models/user.model");
const _basegraphqlmodel = require("../../common/models/base.graphql.model");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let Post = class Post extends _basegraphqlmodel.BaseGraphqlModel {
};
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], Post.prototype, "title", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], Post.prototype, "content", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean),
    _ts_metadata("design:type", Boolean)
], Post.prototype, "published", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_usermodel.User, {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], Post.prototype, "author", void 0);
Post = _ts_decorate([
    (0, _graphql.ObjectType)()
], Post);
