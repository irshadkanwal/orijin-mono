"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PostConnection", {
    enumerable: true,
    get: function() {
        return PostConnection;
    }
});
const _graphql = require("@nestjs/graphql");
const _pagination = /*#__PURE__*/ _interop_require_default(require("../../common/pagination/pagination"));
const _postmodel = require("./post.model");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let PostConnection = class PostConnection extends (0, _pagination.default)(_postmodel.Post) {
};
PostConnection = _ts_decorate([
    (0, _graphql.ObjectType)()
], PostConnection);
