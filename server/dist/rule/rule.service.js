"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RuleService", {
    enumerable: true,
    get: function() {
        return RuleService;
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
let RuleService = class RuleService {
    async getAllRules() {
        return this.prisma.rule.findMany();
    }
    async getOne(id) {
        const rule = await this.prisma.rule.findUnique({
            where: {
                id
            }
        });
        if (!rule) {
            throw new _common.NotFoundException(`Rule with ID ${id} not found`);
        }
        return rule;
    }
    async createRule(data) {
        return this.prisma.rule.create({
            data
        });
    }
    async updateRule(id, data) {
        const rule = await this.prisma.rule.update({
            where: {
                id
            },
            data
        });
        if (!rule) {
            throw new _common.NotFoundException(`Rule with ID ${id} not found`);
        }
        return rule;
    }
    async deleteRule(id) {
        try {
            await this.prisma.rule.delete({
                where: {
                    id
                }
            });
            return true;
        } catch (error) {
            throw new _common.NotFoundException(`Rule with ID ${id} not found`);
        }
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
RuleService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService
    ])
], RuleService);
