"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CropvarietyService", {
    enumerable: true,
    get: function() {
        return CropvarietyService;
    }
});
const _common = require("@nestjs/common");
const _nestjsprisma = require("nestjs-prisma");
const _AbstractService = /*#__PURE__*/ _interop_require_default(require("../common/service/AbstractService"));
const _prismahelper = require("../common/prisma.helper");
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
let CropvarietyService = class CropvarietyService extends _AbstractService.default {
    standardInclude() {
        return this.commonInclude;
    }
    // comment this code because we are using generic many functions
    async getMany(filters) {
        const { sort, sortOrder, name } = filters;
        const where = {
            organisation: filters.organisation,
            shortCode: filters.shortCode || undefined,
            name: filters.name ? {
                contains: filters.name,
                mode: 'insensitive'
            } : undefined,
            crop: filters['crop.name'] //
             ? {
                name: filters['crop.name']
            } : undefined
        };
        const orderBy = sort ? [
            {
                [sort]: sortOrder || 'asc'
            }
        ] : [];
        const args = {
            where,
            orderBy: orderBy,
            include: this.commonInclude,
            ...(0, _prismahelper.addPagination)(filters)
        };
        const items = await this.prisma.cropVariety.findMany(args);
        return {
            data: items.map(this.convertModel),
            count: items.length
        };
    }
    getDefaultOrderBy() {
        return [
            {
                createdAt: 'desc'
            }
        ];
    }
    async connectDependenciesForCreateAndUpdate(body, isUpdate) {
        const { cropId, cropCode, ...rest } = body;
        const storedCrops = await this.prisma.crop.findMany({
            where: {
                AND: [
                    {
                        organisation: body.organisation
                    },
                    {
                        OR: [
                            {
                                id: cropId
                            },
                            {
                                shortCode: cropCode
                            }
                        ]
                    }
                ]
            }
        });
        if (storedCrops.length === 0) {
            throw new Error('Crop not found for code ' + (cropCode || cropId));
        }
        return {
            ...rest,
            crop: {
                connect: {
                    id: storedCrops[0].id
                }
            }
        };
    }
    async convertForImport(body) {
        const res = {
            ...body
        };
        return res;
    }
    constructor(prisma){
        super(prisma, prisma.cropVariety);
        this.prisma = prisma;
        this.logger = new _common.Logger(CropvarietyService.name);
        this.commonInclude = {
            crop: true
        };
    }
};
CropvarietyService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService
    ])
], CropvarietyService);
