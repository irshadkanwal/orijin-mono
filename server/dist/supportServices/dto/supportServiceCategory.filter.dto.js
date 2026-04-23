"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SupportServiceCategoryFilterDto", {
    enumerable: true,
    get: function() {
        return SupportServiceCategoryFilterDto;
    }
});
const _prismahelper = require("../../common/prisma.helper");
const _paginationAndSortingdto = require("../../common/dto/paginationAndSorting.dto");
const _classvalidator = require("class-validator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let SupportServiceCategoryFilterDto = class SupportServiceCategoryFilterDto extends _paginationAndSortingdto.StandardFilterDto {
};
_ts_decorate([
    (0, _prismahelper.FilterType)('text'),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)()
], SupportServiceCategoryFilterDto.prototype, "categoryType", void 0);
