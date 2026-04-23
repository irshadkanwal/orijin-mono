"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WalletsService", {
    enumerable: true,
    get: function() {
        return WalletsService;
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
let WalletsService = class WalletsService extends _AbstractService.default {
    async convertForImport(body) {
        const res = {
            ...body
        };
        return res;
    }
    async connectDependenciesForCreateAndUpdate(body, isUpdate) {
        const { contactId, contactCode, ...rest } = body;
        const storedContact = await this.prisma.contact.findMany({
            where: {
                AND: [
                    {
                        organisation: body.organisation
                    },
                    {
                        OR: [
                            {
                                id: contactId
                            },
                            {
                                shortCode: contactCode
                            }
                        ]
                    }
                ]
            }
        });
        if (storedContact.length === 0) {
            throw new Error('contact not found for code ' + (contactCode || contactId));
        }
        return {
            ...rest,
            contact: {
                connect: {
                    id: storedContact[0].id
                }
            }
        };
    }
    constructor(prisma){
        super(prisma, prisma.wallet);
        this.prisma = prisma;
        this.logger = new _common.Logger(WalletsService.name);
    }
};
WalletsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService
    ])
], WalletsService);
