"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SupportServiceInputTypeService", {
    enumerable: true,
    get: function() {
        return SupportServiceInputTypeService;
    }
});
const _common = require("@nestjs/common");
const _nestjsprisma = require("nestjs-prisma");
const _AbstractService = /*#__PURE__*/ _interop_require_default(require("../common/service/AbstractService"));
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
let SupportServiceInputTypeService = class SupportServiceInputTypeService extends _AbstractService.default {
    standardInclude() {
        return {
            supportingServiceCategory: true
        };
    }
    async connectDependenciesForCreateAndUpdate(body, isUpdate) {
        const { supportingServiceCategoryCode, ...rest } = body;
        const csvInput = body;
        const dtoInput = body;
        let supportingServiceCategoryId = dtoInput.supportingServiceCategoryId;
        delete rest['supportingServiceCategoryId'];
        delete rest['supportingServiceInputTypeCode'];
        const cats = await this.prisma.supportingServiceCategory.findMany({
            where: {
                AND: [
                    {
                        organisation: body.organisation
                    },
                    {
                        OR: [
                            {
                                id: supportingServiceCategoryId
                            },
                            {
                                shortCode: supportingServiceCategoryCode
                            }
                        ]
                    }
                ]
            }
        });
        if (cats.length !== 1) {
            throw new Error('supportingServiceCategory not found for code ' + (supportingServiceCategoryId || supportingServiceCategoryCode));
        }
        supportingServiceCategoryId = cats[0].id;
        const updateData = {
            ...rest,
            supportingServiceCategory: {
                connect: {
                    id: supportingServiceCategoryId
                }
            }
        };
        return updateData;
    }
    constructor(prisma){
        super(prisma, prisma.supportingServiceInputType);
        this.prisma = prisma;
        this.logger = new _common.Logger(SupportServiceInputTypeService.name);
    }
};
SupportServiceInputTypeService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService
    ])
], SupportServiceInputTypeService);
