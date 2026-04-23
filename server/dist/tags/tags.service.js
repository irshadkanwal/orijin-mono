"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TagsService", {
    enumerable: true,
    get: function() {
        return TagsService;
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
function convert(prismaTagClient) {
    return {
        ...prismaTagClient
    };
}
let TagsService = class TagsService {
    async getOne(id) {
        const prismaTagClient = await this.prisma.tag.findUnique({
            where: {
                id: id
            }
        });
        return convert(prismaTagClient);
    }
    async getAll() {
        const prismaPromise = await this.prisma.tag.findMany();
        return prismaPromise.map((a)=>convert(a));
    }
    async create(body) {
        const { ...restOfValues } = body.values;
        return convert(await this.prisma.tag.create({
            data: {
                ...restOfValues
            }
        }));
    }
    constructor(prisma){
        this.prisma = prisma;
        this.logger = new _common.Logger(TagsService.name);
    }
};
TagsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService
    ])
], TagsService);
