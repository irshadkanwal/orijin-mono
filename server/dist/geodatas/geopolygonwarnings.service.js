"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PolygonWarningService", {
    enumerable: true,
    get: function() {
        return PolygonWarningService;
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
let PolygonWarningService = class PolygonWarningService {
    async fixPolygonInteractionWarnings(interactionWarning) {
        return this.prisma.polygonInteractionWarning.update({
            where: {
                id: interactionWarning.id
            },
            data: {
                fixed: true
            }
        });
    }
    async createPolygonInteractionWarnings(interactionWarning) {
        return this.prisma.polygonInteractionWarning.create({
            data: interactionWarning
        });
    }
    async fixInactivePolygonWarnings(polygonId) {
        const res = this.prisma.polygonInteractionWarning.updateMany({
            where: {
                polygons: {
                    some: {
                        id: polygonId
                    }
                },
                fixed: false
            },
            data: {
                fixed: true
            }
        });
        return res;
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
PolygonWarningService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService
    ])
], PolygonWarningService);
