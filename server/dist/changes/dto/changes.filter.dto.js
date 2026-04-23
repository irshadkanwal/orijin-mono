"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ChangesFilter", {
    enumerable: true,
    get: function() {
        return ChangesFilter;
    }
});
const _prismahelper = require("../../common/prisma.helper");
const _paginationAndSortingdto = require("../../common/dto/paginationAndSorting.dto");
const _classvalidator = require("class-validator");
const _changesmodel = require("../models/changes.model");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ChangesFilter = class ChangesFilter extends _paginationAndSortingdto.PaginationAndSortingDto {
};
_ts_decorate([
    (0, _prismahelper.FilterType)('text'),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], ChangesFilter.prototype, "id", void 0);
_ts_decorate([
    (0, _prismahelper.FilterType)('text'),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], ChangesFilter.prototype, "objectId", void 0);
_ts_decorate([
    (0, _prismahelper.FilterType)('text'),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], ChangesFilter.prototype, "objectType", void 0);
_ts_decorate([
    (0, _prismahelper.FilterType)('text'),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", typeof _changesmodel.ChangeSourceType === "undefined" ? Object : _changesmodel.ChangeSourceType)
], ChangesFilter.prototype, "sourceType", void 0);
_ts_decorate([
    (0, _prismahelper.FilterType)('date'),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsDate)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], ChangesFilter.prototype, "startTime", void 0);
_ts_decorate([
    (0, _prismahelper.FilterType)('date'),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsDate)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], ChangesFilter.prototype, "endTime", void 0);
_ts_decorate([
    (0, _prismahelper.FilterType)('text'),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], ChangesFilter.prototype, "name", void 0);
_ts_decorate([
    (0, _prismahelper.FilterType)('text'),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], ChangesFilter.prototype, "newValue", void 0);
