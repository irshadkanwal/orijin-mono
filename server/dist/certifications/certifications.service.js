"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CertificationsService", {
    enumerable: true,
    get: function() {
        return CertificationsService;
    }
});
const _common = require("@nestjs/common");
const _nestjsprisma = require("nestjs-prisma");
const _AbstractService = /*#__PURE__*/ _interop_require_wildcard(require("../common/service/AbstractService"));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
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
let CertificationsService = class CertificationsService extends _AbstractService.default {
    async connectDependenciesForCreateAndUpdate(body, isUpdate) {
        const { certificationTypeId, farmId, farmCode, certificationTypeCode, ...rest } = body;
        let cId = certificationTypeId;
        let fId = farmId;
        if (!certificationTypeId && !certificationTypeCode) {
            throw Error('Either certificationTypeId or certificationTypeCode has to be provided');
        }
        if (certificationTypeCode) {
            cId = (await this.prisma.certificationType.findUnique({
                where: {
                    shortCode_organisation: {
                        shortCode: certificationTypeCode,
                        organisation: body.organisation
                    }
                }
            }))['id'];
        }
        if (farmCode) {
            fId = (await this.prisma.farm.findMany({
                where: {
                    AND: [
                        {
                            organisation: body.organisation
                        },
                        {
                            OR: [
                                {
                                    id: farmId
                                }
                            ]
                        },
                        {
                            facility: {
                                is: {
                                    shortCode: farmCode
                                }
                            }
                        }
                    ]
                }
            }))[0]['id'];
        }
        return {
            ...rest,
            farm: {
                connect: {
                    id: fId
                }
            },
            certificationType: {
                connect: {
                    id: cId
                }
            }
        };
    }
    async convertForImport(body) {
        const res = {
            ...body,
            startsAt: (0, _AbstractService.parseDateForImport)(body?.startsAt),
            endsAt: (0, _AbstractService.parseDateForImport)(body?.endsAt)
        };
        return res;
    }
    constructor(prisma){
        super(prisma, prisma.certification);
        this.prisma = prisma;
        this.logger = new _common.Logger(CertificationsService.name);
    }
};
CertificationsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService
    ])
], CertificationsService);
