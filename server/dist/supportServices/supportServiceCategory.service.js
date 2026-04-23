"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SupportServiceCategoryService", {
    enumerable: true,
    get: function() {
        return SupportServiceCategoryService;
    }
});
const _common = require("@nestjs/common");
const _nestjsprisma = require("nestjs-prisma");
const _AbstractService = /*#__PURE__*/ _interop_require_default(require("../common/service/AbstractService"));
const _prismahelper = require("../common/prisma.helper");
const _client = require("@prisma/client");
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
let SupportServiceCategoryService = class SupportServiceCategoryService extends _AbstractService.default {
    standardInclude() {
        return {
            supportingServiceCategoryType: true
        };
    }
    async connectDependenciesForCreateAndUpdate(body, isUpdate) {
        const { supportingServiceCategoryTypeId, supportingServiceCategoryTypeCode, service, ...rest } = body;
        const serviceId = service ? service : supportingServiceCategoryTypeId;
        const deps = await this.prisma.supportingServiceCategoryType.findMany({
            where: {
                AND: [
                    {
                        organisation: body.organisation
                    },
                    {
                        OR: [
                            {
                                id: serviceId
                            },
                            {
                                shortCode: supportingServiceCategoryTypeCode
                            }
                        ]
                    }
                ]
            }
        });
        if (deps.length === 0) {
            throw new Error(`supportingServiceCategoryType not found for code ${supportingServiceCategoryTypeId || supportingServiceCategoryTypeId} ${body.organisation}`);
        }
        return {
            ...rest,
            supportingServiceCategoryType: {
                connect: {
                    id: deps[0].id
                }
            }
        };
    }
    convertModel(prismaType) {
        return {
            ...prismaType,
            //TODO: SM need to fix all these types
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            service: prismaType.supportingServiceCategoryType
        };
    }
    async getMany(filters) {
        const { pagination, sorting, filters: filterFields } = (0, _prismahelper.parseFilters)(filters);
        const { sort, sortOrder } = sorting;
        const inputPagination = (0, _prismahelper.addPagination)(pagination);
        const orderBy = sort ? [
            {
                [sort]: sortOrder || 'asc'
            }
        ] : this.getDefaultOrderBy();
        // const args: Prisma.SupportingServiceCategoryTypeFindManyArgs = {
        console.log(this.convertFiltersToWhere(filterFields));
        const args = {
            where: this.convertFiltersToWhere(filterFields),
            orderBy: orderBy,
            include: this.standardInclude(),
            ...inputPagination
        };
        // const items = await this.prismaDelegate.findMany(arg0);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const [data, count] = await this.prisma.$transaction([
            this.prisma.supportingServiceCategory.findMany(args),
            this.prisma.supportingServiceCategory.count({
                where: args.where
            })
        ]);
        // return { data, count };
        return {
            data: data.map(this.convertModel),
            count: count
        };
    }
    constructor(prisma){
        super(prisma, prisma.supportingServiceCategory);
        this.prisma = prisma;
        this.logger = new _common.Logger(SupportServiceCategoryService.name);
        this.convertFiltersToWhere = (filterFields)=>{
            const { shortCode, organisation, categoryType } = filterFields;
            if (!organisation) {
                throw new Error('Search without organisation not allowed');
            }
            const decodedSearchTerm = shortCode ? decodeURIComponent(shortCode).trim() : undefined;
            const where = {
                organisation: filterFields.organisation,
                deletedAt: null,
                OR: []
            };
            if (decodedSearchTerm) {
                where.OR.push({
                    name: {
                        contains: decodedSearchTerm,
                        mode: _client.Prisma.QueryMode.insensitive
                    }
                });
                where.OR.push({
                    shortCode: {
                        contains: decodedSearchTerm,
                        mode: _client.Prisma.QueryMode.insensitive
                    }
                });
            }
            if (where.OR.length === 0) {
                delete where.OR;
            }
            if (categoryType) {
                const categoryTypes = decodeURIComponent(categoryType).split(',');
                where.supportingServiceCategoryType = {
                    OR: categoryTypes.map((categoryTypeField)=>({
                            OR: [
                                {
                                    name: {
                                        equals: categoryTypeField,
                                        mode: 'insensitive'
                                    }
                                },
                                {
                                    shortCode: {
                                        equals: categoryTypeField,
                                        mode: 'insensitive'
                                    }
                                }
                            ]
                        }))
                };
            }
            console.log('where: ----------', where);
            return where;
        };
    }
};
SupportServiceCategoryService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService
    ])
], SupportServiceCategoryService);
