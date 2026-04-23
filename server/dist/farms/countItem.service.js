"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CountItemService", {
    enumerable: true,
    get: function() {
        return CountItemService;
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
function convert(prismaCountItemClient) {
    return {
        ...prismaCountItemClient,
        type: prismaCountItemClient.type,
        category: prismaCountItemClient.category,
        subType: prismaCountItemClient.subType
    };
}
let CountItemService = class CountItemService {
    async getOne(id) {
        const prismaCountItemClient = await this.prisma.countItem.findUnique({
            where: {
                id: id
            }
        });
        return convert(prismaCountItemClient);
    }
    async getAll() {
        const prismaPromise = await this.prisma.countItem.findMany();
        return prismaPromise.map((a)=>convert(a));
    }
    constructor(prisma){
        this.prisma = prisma;
        this.logger = new _common.Logger(CountItemService.name);
    }
};
CountItemService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService
    ])
], CountItemService);
