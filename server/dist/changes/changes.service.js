"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ChangesService", {
    enumerable: true,
    get: function() {
        return ChangesService;
    }
});
const _common = require("@nestjs/common");
const _nestjsprisma = require("nestjs-prisma");
const _prismahelper = require("../common/prisma.helper");
const _client = require("@prisma/client");
const _AbstractService = /*#__PURE__*/ _interop_require_default(require("../common/service/AbstractService"));
const _crypto = require("crypto");
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
const serialize = (value)=>{
    if (value === null || value === undefined) {
        return null;
    }
    if (value instanceof _client.Prisma.Decimal) {
        return value.toString();
    }
    if (typeof value === 'object') {
        return JSON.stringify(value);
    }
    return String(value);
};
let ChangesService = class ChangesService extends _AbstractService.default {
    async getMany(filters) {
        const args = {
            where: this.convertFiltersToWhere(filters),
            orderBy: {
                startTime: 'desc'
            },
            ...(0, _prismahelper.addPagination)(filters)
        };
        const [data, count] = await this.prisma.$transaction([
            this.prisma.change.findMany(args),
            this.prisma.change.count({
                where: args.where
            })
        ]);
        return {
            data: data,
            count
        };
    }
    async populate(objectId, objectType, sourceType, updatedBy, operationType, diff) {
        const transaction = (0, _crypto.randomUUID)();
        const startTime = new Date();
        const latest = await this.prisma.change.findMany({
            where: {
                objectType,
                objectId,
                endTime: new Date('2100-01-01T00:00:00.000Z')
            },
            orderBy: {
                startTime: 'desc'
            }
        });
        if (latest.length > 0) {
            // Mark the previous changes as ended
            await this.prisma.change.updateMany({
                where: {
                    id: {
                        in: latest.map((c)=>c.id)
                    },
                    name: {
                        in: Object.keys(diff)
                    }
                },
                data: {
                    endTime: startTime
                }
            });
        }
        const fields = this.prisma[objectType].fields;
        if (!fields) {
            throw new Error(`Prisma fields not found for ${objectType}`);
        }
        const fieldNames = Object.keys(fields);
        // Add the new changes
        const data = Object.entries(diff).map(([name, o])=>({
                id: (0, _crypto.randomUUID)(),
                transaction,
                objectId,
                objectType,
                sourceType,
                operationType,
                updatedBy,
                name,
                oldValue: serialize(o.oldValue) || null,
                newValue: serialize(o.newValue) || null,
                startTime: startTime,
                endTime: new Date('2100-01-01T00:00:00.000Z')
            })).filter((d)=>fieldNames.includes(d.name)).filter((d)=>d.oldValue !== d.newValue);
        const extraFieldsChanges = data.filter((d)=>!fieldNames.includes(d.name));
        if (extraFieldsChanges.length > 0) {
            this.logger.warn(`Unknown fields for ${objectType}: ${extraFieldsChanges.map((c)=>c.name).join(', ')}`);
        }
        await this.prisma.change.createMany({
            data
        });
    }
    constructor(prisma){
        super(prisma, prisma.change);
        this.prisma = prisma;
        this.logger = new _common.Logger(ChangesService.name);
        this.convertFiltersToWhere = (filters)=>{
            return filters;
        };
    }
};
ChangesService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService
    ])
], ChangesService);
