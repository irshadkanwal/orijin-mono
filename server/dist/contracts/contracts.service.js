"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ContractsService", {
    enumerable: true,
    get: function() {
        return ContractsService;
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
function convert(prismaClient) {
    const result = {
        ...prismaClient
    };
    return result;
}
let ContractsService = class ContractsService {
    async getOne(id) {
        const prismaContractClient = await this.prisma.contract.findUnique({
            where: {
                id: id
            }
        });
        return convert(prismaContractClient);
    }
    async getAll() {
        const contracts = await this.prisma.contract.findMany();
        return contracts.map((contract)=>convert(contract));
    }
    async create(body) {
        const { ...restOfValues } = body.values;
        // Person did not exist in the schema
        // if (!personId && !personCode) {
        //   throw Error('Either personId or personCode has to be provided');
        // }
        // let pId = personId;
        // if (personCode) {
        //   pId = (
        //     await this.prisma.person.findUnique({
        //       where: { shortCode: personCode },
        //     })
        //   ).id;
        // }
        return convert(await this.prisma.contract.create({
            data: {
                ...restOfValues,
                organisation: body.meta.organisation
            }
        }));
    }
    constructor(prisma){
        this.prisma = prisma;
        this.logger = new _common.Logger(ContractsService.name);
    }
};
ContractsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService
    ])
], ContractsService);
