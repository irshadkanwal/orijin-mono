"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ContactsService", {
    enumerable: true,
    get: function() {
        return ContactsService;
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
let ContactsService = class ContactsService extends _AbstractService.default {
    async connectDependenciesForCreateAndUpdate(body, isUpdate) {
        const { personId, personCode, ...rest } = body;
        const storedPerson = await this.prisma.person.findMany({
            where: {
                AND: [
                    {
                        organisation: body.organisation
                    },
                    {
                        OR: [
                            {
                                id: personId
                            },
                            {
                                shortCode: personCode
                            }
                        ]
                    }
                ]
            }
        });
        if (storedPerson.length === 0) {
            throw new Error('person not found for code ' + (personCode || personId));
        }
        return {
            ...rest,
            person: {
                connect: {
                    id: storedPerson[0].id
                }
            }
        };
    }
    constructor(prisma){
        super(prisma, prisma.contact);
        this.prisma = prisma;
        this.logger = new _common.Logger(ContactsService.name);
    }
};
ContactsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService
    ])
], ContactsService);
