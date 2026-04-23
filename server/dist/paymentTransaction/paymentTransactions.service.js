"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PaymentTransactionsService", {
    enumerable: true,
    get: function() {
        return PaymentTransactionsService;
    }
});
const _common = require("@nestjs/common");
const _nestjsprisma = require("nestjs-prisma");
const _prismahelper = require("../common/prisma.helper");
const _client = require("@prisma/client");
const _AbstractService = /*#__PURE__*/ _interop_require_default(require("../common/service/AbstractService"));
const _changesservice = require("../changes/changes.service");
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
let PaymentTransactionsService = class PaymentTransactionsService extends _AbstractService.default {
    standardInclude() {
        return {
            lot: true,
            farm: {
                include: {
                    facility: true
                }
            }
        };
    }
    async getMany(filters) {
        const { sort, sortOrder, name } = filters;
        const where = {
            organisation: filters.organisation,
            payeeFirstName: name ? {
                contains: name,
                mode: _client.Prisma.QueryMode.insensitive
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
            include: this.standardInclude(),
            ...(0, _prismahelper.addPagination)(filters)
        };
        const items = await this.prisma.paymentTransaction.findMany(args);
        return {
            data: items.map(this.convertModel),
            count: items.length
        };
    }
    constructor(prisma, changes){
        super(prisma, prisma.paymentTransaction, changes);
        this.prisma = prisma;
        this.changes = changes;
        this.logger = new _common.Logger(PaymentTransactionsService.name);
        this.objectType = 'PaymentTransaction';
    }
};
PaymentTransactionsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService,
        typeof _changesservice.ChangesService === "undefined" ? Object : _changesservice.ChangesService
    ])
], PaymentTransactionsService);
