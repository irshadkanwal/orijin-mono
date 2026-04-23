"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FarmStatsService", {
    enumerable: true,
    get: function() {
        return FarmStatsService;
    }
});
const _common = require("@nestjs/common");
const _nestjsprisma = require("nestjs-prisma");
const _farmsservice = require("./farms.service");
const _farmfilters = require("./farm.filters");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let FarmStatsService = class FarmStatsService {
    async getFarmCount(where) {
        const farmCount = await this.prisma.farm.aggregate({
            _count: true,
            where
        });
        const farmList = await this.prisma.farm.findMany({
            where,
            include: {
                facility: true
            }
        });
        return {
            farmCount,
            farmList: farmList.map((farm)=>this.farmsService.convert(farm).facility.shortCode)
        };
    }
    async getGenderSplit(where) {
        const { facility, season, ...restOfConditions } = where;
        return this.prisma.person.groupBy({
            by: [
                'gender'
            ],
            _count: {
                _all: true
            },
            where: {
                mainContactPersonFor: {
                    some: {
                        ...facility,
                        farm: {
                            season: season
                        }
                    }
                },
                ...restOfConditions
            }
        });
    }
    async getPlotManualSizeStats(where) {
        return this.prisma.plot.aggregate({
            _count: true,
            _avg: {
                areaSizeManual: true
            },
            _sum: {
                areaSizeManual: true
            },
            where: {
                // active: true,
                deletedAt: null,
                areaSizeManual: {
                    lt: 50
                },
                farm: {
                    is: where
                }
            }
        });
    }
    async getPolygonSizeStats(where) {
        return this.prisma.polygon.aggregate({
            _count: true,
            _avg: {
                areaCalculated: true
            },
            _sum: {
                areaCalculated: true
            },
            where: {
                active: true,
                areaCalculated: {
                    not: null
                },
                plot: {
                    farm: {
                        is: where
                    }
                }
            }
        });
    }
    async getPolygonWarningsStat(where) {
        const internalWarningCount = await this.prisma.polygonWarning.groupBy({
            by: [
                'key'
            ],
            where: {
                fixed: false,
                polygon: {
                    active: true,
                    plot: {
                        farm: {
                            is: where
                        }
                    }
                }
            },
            _count: {
                key: true
            }
        });
        const interactionWarningsCount = await this.prisma.polygonInteractionWarning.groupBy({
            by: [
                'key'
            ],
            where: {
                fixed: false,
                polygons: {
                    every: {
                        active: true,
                        plot: {
                            farm: {
                                is: where
                            }
                        }
                    }
                }
            },
            _count: {
                key: true
            }
        });
        const warningsCount = [
            ...interactionWarningsCount,
            ...internalWarningCount
        ];
        const warningsStat = warningsCount.reduce((acc, curr)=>{
            acc[curr.key] = curr._count.key;
            return acc;
        }, {});
        return warningsStat;
    }
    async getPlotStats(where) {
        const count = await this.prisma.plot.aggregate({
            _count: true,
            where: {
                deletedAt: null,
                ...where
            }
        });
        const list = await this.prisma.plot.findMany({
            where: {
                deletedAt: null,
                ...where
            }
        });
        return {
            count: count._count,
            list: list.map((plot)=>plot.shortCode + ' ' + plot.polygons?.map((poly)=>poly.areaCalculated))
        };
    }
    async getValidPlotCount(where) {
        return this.getPlotStats({
            farm: where,
            polygons: this.validPolygonExists
        });
    }
    async getInvalidPlotCount(where) {
        return this.getPlotStats({
            farm: where,
            polygons: {
                some: {},
                every: {
                    areaCalculated: null
                }
            }
        });
    }
    async getNopolygonPlotCount(where) {
        return this.getPlotStats({
            farm: where,
            polygons: {
                none: {}
            }
        });
    }
    async getSatellitePendingPlots(where) {
        return this.getPlotStats({
            farm: where,
            polygons: this.validPolygonExists,
            OR: [
                {
                    satelliteAnalysis: {
                        none: {}
                    }
                },
                {
                    satelliteAnalysis: {
                        every: {
                            deforestationAreaHa: null
                        }
                    }
                }
            ]
        });
    }
    async getSatelliteAnalyzedPlotsWithRisk(where) {
        return this.getPlotStats({
            farm: where,
            satelliteAnalysis: {
                some: {
                    OR: [
                        {
                            deforestationRisk: 'medium'
                        },
                        {
                            deforestationRisk: 'high'
                        }
                    ]
                }
            }
        });
    }
    async getSatelliteAnalyzedPlotsWithoutRisk(where) {
        return this.getPlotStats({
            farm: where,
            satelliteAnalysis: {
                some: {
                    deforestationRisk: 'low'
                }
            }
        });
    }
    async getStats(filters) {
        let where = {
            organisation: filters.organisation,
            season: filters.seasonCode ? {
                shortCode: filters.seasonCode
            } : undefined,
            facility: {
                AND: []
            }
        };
        where = this.farmFilters.addLocationFilters(filters, where, 'location');
        where = this.farmFilters.addLocationFilters(filters, where, 'customLocation');
        // console.log('where', JSON.stringify(where, null, 4));
        const farmCount = await this.getFarmCount(where);
        const farmCountData = farmCount.farmCount._count;
        let sizeStats = await this.getPolygonSizeStats(where);
        if (!sizeStats._sum.areaCalculated) {
            // No polygons, fall back to manual
            sizeStats = await this.getPlotManualSizeStats(where);
            console.log(sizeStats);
        }
        const genders = await this.getGenderSplit(where);
        // Plot summary
        // Main categories
        const noPolygonCount = await this.getNopolygonPlotCount(where);
        const invalidPlotCount = await this.getInvalidPlotCount(where);
        const validPlotCount = await this.getValidPlotCount(where);
        // "Valid pots" divide into these:
        const pendingAnalysis = await this.getSatellitePendingPlots(where);
        const plotsWithRisk = await this.getSatelliteAnalyzedPlotsWithRisk(where);
        const plotsWithoutRisk = await this.getSatelliteAnalyzedPlotsWithoutRisk(where);
        const polygonWarningsCount = await this.getPolygonWarningsStat(where);
        const plots = {
            total: noPolygonCount.count + invalidPlotCount.count + validPlotCount.count,
            noPolygons: noPolygonCount.count,
            invalidPolygons: invalidPlotCount.count,
            pendingAnalysis: pendingAnalysis.count,
            hasRisk: plotsWithRisk.count,
            noRisk: plotsWithoutRisk.count
        };
        const plotsList = {
            noPolygons: noPolygonCount.list,
            invalidPolygons: invalidPlotCount.list,
            pendingAnalysis: pendingAnalysis.list,
            hasRisk: plotsWithRisk.list,
            noRisk: plotsWithoutRisk.list
        };
        // Uncomment for easy debugging
        // console.log(plotsList);
        this.logger.log('warning count:', polygonWarningsCount);
        return {
            plots,
            farmCount: farmCountData,
            averagePolygonSize: sizeStats._avg.areaCalculated || sizeStats._avg.areaSizeManual,
            totalPolygonSizes: sizeStats._sum.areaCalculated || sizeStats._sum.areaSizeManual,
            genders: {
                female: genders.find((e)=>e.gender === 'Female')?._count._all || 0,
                male: genders.find((e)=>e.gender === 'Male')?._count._all || 0
            },
            polygonWarningsCount
        };
    }
    constructor(prisma, farmsService, farmFilters){
        this.prisma = prisma;
        this.farmsService = farmsService;
        this.farmFilters = farmFilters;
        this.logger = new _common.Logger(FarmStatsService.name);
        this.validPolygonExists = {
            some: {
                areaCalculated: {
                    not: null
                },
                active: true
            }
        };
    }
};
FarmStatsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService,
        typeof _farmsservice.FarmsService === "undefined" ? Object : _farmsservice.FarmsService,
        typeof _farmfilters.FarmFilters === "undefined" ? Object : _farmfilters.FarmFilters
    ])
], FarmStatsService);
