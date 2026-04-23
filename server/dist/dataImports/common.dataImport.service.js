"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CommonDataImportService", {
    enumerable: true,
    get: function() {
        return CommonDataImportService;
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
let CommonDataImportService = class CommonDataImportService {
    async emptyDbForOrganisation(prismaService, org) {
        await prismaService.satelliteAnalysis.deleteMany({
            where: {
                plot: {
                    is: {
                        farm: {
                            is: {
                                organisation: org
                            }
                        }
                    }
                }
            }
        });
        await prismaService.polygonInteractionWarning.deleteMany({
            where: {
                polygons: {
                    every: {
                        plot: {
                            is: {
                                farm: {
                                    is: {
                                        organisation: org
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        await prismaService.polygonWarning.deleteMany({
            where: {
                polygon: {
                    is: {
                        plot: {
                            is: {
                                farm: {
                                    is: {
                                        organisation: org
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        await prismaService.polygon.deleteMany({
            where: {
                plot: {
                    is: {
                        farm: {
                            is: {
                                organisation: org
                            }
                        }
                    }
                }
            }
        });
        await prismaService.plot.deleteMany({
            where: {
                farm: {
                    is: {
                        organisation: org
                    }
                }
            }
        });
        await prismaService.person.deleteMany({
            where: {
                mainContactPersonFor: {
                    every: {
                        organisation: org
                    }
                }
            }
        });
        await prismaService.farm.deleteMany({
            where: {
                organisation: org
            }
        });
        await prismaService.facility.deleteMany({
            where: {
                farm: null
            }
        });
    }
    async seedCommodity(commodity, org) {
        let commodityInDb = await this.prisma.crop.findUnique({
            where: {
                shortCode_organisation: {
                    shortCode: commodity,
                    organisation: org
                }
            }
        });
        if (!commodityInDb) {
            commodityInDb = await this.prisma.crop.create({
                data: {
                    shortCode: commodity,
                    name: commodity,
                    organisation: org
                }
            });
            await this.prisma.cropVariety.create({
                data: {
                    shortCode: commodity + '-1',
                    name: commodity,
                    cropId: commodityInDb.id,
                    organisation: org
                }
            });
        }
    }
    constructor(prisma){
        this.prisma = prisma;
        this.logger = new _common.Logger(CommonDataImportService.name);
    }
};
CommonDataImportService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService
    ])
], CommonDataImportService);
