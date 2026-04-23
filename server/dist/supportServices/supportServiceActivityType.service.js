"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SupportServiceActivityTypeService", {
    enumerable: true,
    get: function() {
        return SupportServiceActivityTypeService;
    }
});
const _common = require("@nestjs/common");
const _nestjsprisma = require("nestjs-prisma");
const _AbstractService = /*#__PURE__*/ _interop_require_default(require("../common/service/AbstractService"));
const _prismaUtils = require("../common/prismaUtils");
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
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let SupportServiceActivityTypeService = class SupportServiceActivityTypeService extends _AbstractService.default {
    standardInclude() {
        return {
            supportingServiceInputType: true,
            supportingServiceCategory: true
        };
    }
    async connectDependenciesForCreateAndUpdate(body, isUpdate) {
        const { supportingServiceCategoryCode, supportingServiceInputTypeCode, ...rest } = body;
        const csvInput = body;
        const dtoInput = body;
        const supportingServiceCategoryId = dtoInput.supportingServiceCategoryId;
        const supportingServiceInputTypeId = dtoInput.supportingServiceInputTypeId;
        const updateData = {
            ...rest
        };
        await (0, _prismaUtils.setupDependencyBasedOnShortCodeOrId)('supportingServiceCategory', // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.prisma.supportingServiceCategory, supportingServiceCategoryCode, supportingServiceCategoryId, body.organisation, true, isUpdate, updateData);
        await (0, _prismaUtils.setupDependencyBasedOnShortCodeOrId)('supportingServiceInputType', // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.prisma.supportingServiceInputType, supportingServiceInputTypeCode, supportingServiceInputTypeId, body.organisation, false, isUpdate, updateData);
        return updateData;
    }
    constructor(prisma){
        super(prisma, prisma.supportingServiceActivityType);
        this.prisma = prisma;
        this.logger = new _common.Logger(SupportServiceActivityTypeService.name);
    }
};
SupportServiceActivityTypeService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService
    ])
], SupportServiceActivityTypeService);
