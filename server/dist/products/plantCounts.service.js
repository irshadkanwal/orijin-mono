"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProductTypesService", {
    enumerable: true,
    get: function() {
        return ProductTypesService;
    }
});
const _common = require("@nestjs/common");
const _nestjsprisma = require("nestjs-prisma");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function convert(prismaProductTypeClient) {
    return {
        ...prismaProductTypeClient
    };
}
let ProductTypesService = class ProductTypesService {
    async getOne(id) {
        const prismaProductTypeClient = await this.prisma.productType.findUnique({
            where: {
                id: id
            }
        });
        return convert(prismaProductTypeClient);
    }
    async getAll() {
        const prismaPromise = await this.prisma.productType.findMany();
        return prismaPromise.map((a)=>convert(a));
    }
    async create(body) {
        const { ...restOfValues } = body;
        return convert(await this.prisma.productType.create({
            data: {
                ...restOfValues
            }
        }));
    }
    constructor(prisma){
        this.prisma = prisma;
        this.logger = new _common.Logger(ProductTypesService.name);
    }
};
ProductTypesService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService
    ])
], ProductTypesService);
