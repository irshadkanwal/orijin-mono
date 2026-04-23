"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserEntity", {
    enumerable: true,
    get: function() {
        return UserEntity;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const UserEntity = (0, _common.createParamDecorator)((data, ctx)=>_graphql.GqlExecutionContext.create(ctx).getContext().req.user);
