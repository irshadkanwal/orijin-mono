"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SupportServiceActivityBeneficiaryService", {
    enumerable: true,
    get: function() {
        return SupportServiceActivityBeneficiaryService;
    }
});
const _common = require("@nestjs/common");
const _nestjsprisma = require("nestjs-prisma");
const _AbstractService = require("../common/service/AbstractService");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let SupportServiceActivityBeneficiaryService = class SupportServiceActivityBeneficiaryService {
    async upsertImport(input) {
        const parent = await this.prisma.supportingServiceActivity.findUnique({
            where: {
                shortCode_organisation: {
                    shortCode: input.serviceActivityCode,
                    organisation: input.organisation
                }
            },
            include: {
                ServiceActivityBeneficiaries: true
            }
        });
        if (!parent) {
            throw Error('activity not found ' + input.serviceActivityCode);
        }
        const person = await this.prisma.person.findUnique({
            where: {
                shortCode_organisation: {
                    organisation: input.organisation,
                    shortCode: input.beneficiaryCode
                }
            }
        });
        if (!person) {
            throw Error('person not found with ' + input.beneficiaryCode);
        }
        const myItem = parent.ServiceActivityBeneficiaries.find((a)=>a.personId === person.id);
        const values = {
            itemValue: (0, _AbstractService.parseFloatForInport)(input.itemValue),
            itemsProcessed: (0, _AbstractService.parseFloatForInport)(input.itemsProcessed),
            primary: (0, _AbstractService.parseBooleanForImport)(input.primary)
        };
        if (myItem) {
            await this.prisma.supportingServiceActivity.update({
                where: {
                    id: parent.id
                },
                data: {
                    ServiceActivityBeneficiaries: {
                        update: {
                            where: {
                                id: myItem.id
                            },
                            data: {
                                ...values
                            }
                        }
                    }
                }
            });
        } else {
            await this.prisma.serviceActivityBeneficiaries.create({
                data: {
                    supportingServiceActivity: {
                        connect: {
                            id: parent.id
                        }
                    },
                    person: {
                        connect: {
                            id: person.id
                        }
                    },
                    ...values
                }
            });
        }
        return parent;
    }
    constructor(prisma){
        this.prisma = prisma;
        this.logger = new _common.Logger(SupportServiceActivityBeneficiaryService.name);
    }
};
SupportServiceActivityBeneficiaryService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService
    ])
], SupportServiceActivityBeneficiaryService);
