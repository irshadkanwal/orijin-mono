"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TagsController", {
    enumerable: true,
    get: function() {
        return TagsController;
    }
});
const _common = require("@nestjs/common");
const _tagsservice = require("./tags.service");
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
let TagsController = class TagsController {
    postTag(body) {
        return this.tagService.create(body);
    }
    getVarieties() {
        return this.tagService.getAll();
    }
    getTag(id) {
        return this.tagService.getOne(id);
    }
    constructor(tagService){
        this.tagService = tagService;
    }
};
_ts_decorate([
    (0, _common.Post)('tags'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        void 0
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], TagsController.prototype, "postTag", null);
_ts_decorate([
    (0, _common.Get)('tags'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], TagsController.prototype, "getVarieties", null);
_ts_decorate([
    (0, _common.Get)('tags/:id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], TagsController.prototype, "getTag", null);
TagsController = _ts_decorate([
    (0, _common.Controller)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _tagsservice.TagsService === "undefined" ? Object : _tagsservice.TagsService
    ])
], TagsController);
