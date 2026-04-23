"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "VesselsService", {
    enumerable: true,
    get: function() {
        return VesselsService;
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
let VesselsService = class VesselsService extends _AbstractService.default {
    standardInclude() {
        return {
            facility: true,
            plot: true
        };
    }
    async connectDependenciesForCreateAndUpdate(body, isUpdate) {
        const { plotId, plotCode, facilityId, facilityCode, ...rest } = body;
        let pId = plotId;
        let fId = facilityId;
        if (plotCode) {
            pId = (await this.prisma.plot.findFirst({
                where: {
                    shortCode: {
                        equals: plotCode,
                        mode: 'insensitive'
                    },
                    farm: {
                        is: {
                            organisation: body.organisation
                        }
                    }
                }
            }))['id'];
        }
        if (facilityCode) {
            fId = (await this.prisma.facility.findMany({
                where: {
                    AND: [
                        {
                            organisation: body.organisation
                        },
                        {
                            OR: [
                                {
                                    id: facilityId
                                }
                            ]
                        },
                        {
                            shortCode: {
                                equals: facilityCode,
                                mode: 'insensitive'
                            }
                        }
                    ]
                }
            }))[0]['id'];
        }
        return {
            ...rest,
            plot: pId ? {
                connect: {
                    id: pId
                }
            } : undefined,
            facility: fId ? {
                connect: {
                    id: fId
                }
            } : undefined
        };
    }
    async convertForImport(body) {
        const res = {
            ...body,
            permanent: (0, _AbstractService.parseBooleanForImport)(body?.permanent),
            size: (0, _AbstractService.parseIntForInport)(body?.size),
            weight: (0, _AbstractService.parseIntForInport)(body?.weight)
        };
        return res;
    }
    constructor(prisma){
        super(prisma, prisma.vessel);
        this.prisma = prisma;
        this.logger = new _common.Logger(VesselsService.name);
    }
};
VesselsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService
    ])
], VesselsService);
