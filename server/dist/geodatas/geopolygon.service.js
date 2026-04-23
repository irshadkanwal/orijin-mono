"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PolygonService", {
    enumerable: true,
    get: function() {
        return PolygonService;
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
let PolygonService = class PolygonService extends _AbstractService.default {
    standardInclude() {
        return {
            plot: true,
            polygonInteractionWarnings: {
                include: {
                    polygons: true
                }
            }
        };
    }
    async getAllActivePolygonsForOrgAndSeason(org, seasonId) {
        return this.prisma.polygon.findMany({
            where: {
                active: true,
                plot: {
                    farm: {
                        organisation: org,
                        seasonId: seasonId
                    }
                }
            },
            include: this.standardInclude(),
            orderBy: {
                plot: {
                    shortCode: 'asc'
                }
            }
        });
    }
    //TODO:
    // implement better way to update warnings
    async updatePolygon(id, polygonData) {
        const { plotId, polygonWarnings, polygonInteractionWarnings, ...restOfData } = polygonData;
        return this.prisma.polygon.update({
            where: {
                id: id
            },
            data: restOfData
        });
    }
    async connectDependenciesForCreateAndUpdate(body, isUpdate) {
        const { plotId, plotCode, ...rest } = body;
        if (!plotCode && !plotId) {
            throw Error('Either plotId or plotCode has to be provided');
        }
        let pId = plotId;
        if (plotCode) {
            pId = (await this.prisma.plot.findFirst({
                where: {
                    shortCode: plotCode
                }
            }))?.id;
        }
        return {
            ...rest,
            plot: {
                connect: {
                    id: pId
                }
            }
        };
    }
    async convertForImport(body) {
        delete body.organisation;
        const res = {
            ...body,
            active: (0, _AbstractService.parseBooleanForImport)(body.active),
            areaCalculated: (0, _AbstractService.parseFloatForInport)(body.areaCalculated)
        };
        return res;
    }
    async findUnique(shortCode, organisation) {
        const existing = await this.prisma.polygon.findFirst({
            where: {
                shortCode: shortCode,
                plot: {
                    farm: {
                        organisation: organisation
                    }
                },
                id: undefined,
                deletedAt: null
            },
            include: this.standardInclude()
        });
        return existing;
    }
    constructor(prisma){
        super(prisma, prisma.polygon);
        this.prisma = prisma;
        this.logger = new _common.Logger(PolygonService.name);
    }
};
PolygonService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService
    ])
], PolygonService);
