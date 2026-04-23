import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { FarmsFilter } from './dto/farms.filter.dto';
import { FarmsService } from './farms.service';
import { Prisma } from '@prisma/client';
import { Plot } from './models/plots.model';
import { FarmFilters } from './farm.filters';

const groupPolygons = (data) => {
  const polygonCounts = {};
  const proessedCombinations = {};
  data.forEach((item) => {
    if (item.polygons && Array.isArray(item.polygons)) {
      // The same overlap might exist as [a, b] and [b, a] for the respective polygons
      const sortedPolygons = item.polygons.sort();
      const key = sortedPolygons.join(',');
      if (!proessedCombinations[key]) {
        proessedCombinations[key] = true;
        item.polygons.forEach((polygon) => {
          polygonCounts[polygon] = (polygonCounts[polygon] || 0) + 1;
        });
      }
    }
  });

  return polygonCounts;
};

const categorizePolygonCounts = (polygonCounts) => {
  const categories = {
    '4 or more': { count: 0, examples: [] },
    '2-3': { count: 0, examples: [] },
    '1': { count: 0, examples: [] },
    err: { count: 0, examples: [] },
  };

  Object.keys(polygonCounts).forEach((shortCode: string) => {
    const count = polygonCounts[shortCode]; // The double count is because each overlap is shown from both sides!
    let key = 'err';
    if (count >= 4) {
      key = '4 or more';
    } else if (count === 2 || count === 3) {
      key = '2-3';
    } else if (count === 1) {
      key = '1';
    }

    categories[key].count++;
    if (categories[key].examples.length < 5) {
      categories[key].examples.push(shortCode);
    }
  });

  return categories;
};

@Injectable()
export class FarmStatsService {
  logger = new Logger(FarmStatsService.name);

  constructor(
    private prisma: PrismaService,
    private farmsService: FarmsService,
    private farmFilters: FarmFilters,
  ) {}

  async getFarmCount(where): Promise<any> {
    const farmCount = await this.prisma.farm.aggregate({
      _count: true,
      where,
    });
    const farmList = await this.prisma.farm.findMany({
      where,
      include: {
        facility: true,
      },
    });
    return {
      farmCount,
      farmList: farmList.map(
        (farm) => this.farmsService.convert(farm).facility.shortCode,
      ),
    };
  }

  async getGenderSplit(where): Promise<any> {
    const { facility, season, ...restOfConditions } = where;
    return this.prisma.person.groupBy({
      by: ['gender'],
      _count: {
        _all: true,
      },
      where: {
        mainContactPersonFor: {
          some: {
            ...facility,
            farm: {
              season: season,
            },
          },
        },
        ...restOfConditions,
      },
    });
  }

  async getPlotManualSizeStats(where): Promise<any> {
    return this.prisma.plot.aggregate({
      _count: true,
      _avg: { areaSizeManual: true },
      _sum: { areaSizeManual: true },
      where: {
        // active: true,
        deletedAt: null,
        areaSizeManual: { lt: 50 }, // Remove unrealistically large plots!
        farm: { is: where },
      },
    });
  }

  async getPolygonSizeStats(where): Promise<any> {
    return this.prisma.polygon.aggregate({
      _count: true,
      _avg: { areaCalculated: true },
      _sum: { areaCalculated: true },
      where: {
        active: true,
        areaCalculated: { not: null },
        plot: {
          farm: { is: where },
        },
      },
    });
  }

  async getPolygonWarningsStat(where): Promise<any> {
    const polygonCriteria = {
      active: true,
      plot: {
        farm: {
          is: where,
        },
      },
    };

    // TODO: Extract overlap warnings by grouping farms into say 1 overlap, 2-4 overlaps, 4+ overlaps..
    const listpolygonInteractionWarning =
      await this.prisma.polygonInteractionWarning.findMany({
        where: {
          fixed: false,
          polygons: {
            some: polygonCriteria,
          },
        },
        include: {
          polygons: {
            select: {
              source: true,
              plot: {
                select: {
                  shortCode: true,
                },
              },
            },
          },
        },
      });

    const conciseList = listpolygonInteractionWarning.map((warn) => ({
      key: warn.key,
      polygons: warn.polygons.map((poly) => poly.plot.shortCode),
    }));

    const grouped = groupPolygons(conciseList);
    console.log(grouped);
    const dash = categorizePolygonCounts(grouped);
    console.log(dash);

    // dash {
    //   "1": {
    //     "count": 349,
    //       "examples": [
    //       "GLA-2134 - GLA-2134-PLOT-1",
    //       "GLA-2137 - GLA-2137-PLOT-1",
    //       "GLA-0016 - GLA-0016-PLOT-1",
    //       "KLL-0113 - KLL-0113-PLOT-1",
    //       "KLL-0116 - KLL-0116-PLOT-1"
    //     ]
    //   },

    const internalWarningCount = await this.prisma.polygonWarning.groupBy({
      by: ['key'],
      where: {
        fixed: false,
        polygon: polygonCriteria,
      },
      _count: {
        key: true,
      },
    });

    // [ { _count: { key: 1324 }, key: 'Interaction-polygon-overlapping' } ]
    // const interactionWarningsCount =
    //   await this.prisma.polygonInteractionWarning.groupBy({
    //     by: ['key'],
    //     where: {
    //       fixed: false,
    //       polygons: {
    //         some: polygonCriteria,
    //       },
    //     },
    //     _count: {
    //       key: true,
    //     },
    //   });

    const interactionWarningsCount = Object.keys(dash).map((key) => {
      return { _count: { key: dash[key].count }, key: 'Overlap ' + key };
    });

    this.logger.debug('interactionWarningsCount', dash);

    const warningsCount = [
      // WARN: 'Interaction-polygon-overlapping' comes from "internalWarningCount" too, but with value 80 when real one is 662..?? Some old data?
      // ...internalWarningCount,
      ...interactionWarningsCount,
    ];
    return warningsCount.reduce((acc, curr) => {
      acc[curr.key] = curr._count.key;
      return acc;
    }, {});
  }

  async getPlotStats(where: Prisma.PlotWhereInput): Promise<any> {
    const count = await this.prisma.plot.aggregate({
      _count: true,
      where: { deletedAt: null, ...where },
    });
    const list: Plot[] = (await this.prisma.plot.findMany({
      where: { deletedAt: null, ...where },
    })) as Plot[];
    return {
      count: count._count,
      list: list.map(
        (plot) =>
          plot.shortCode +
          ' ' +
          plot.polygons?.map((poly) => poly.areaCalculated),
      ),
    };
  }

  validPolygonExists = {
    some: {
      areaCalculated: { not: null },
      active: true,
    },
  };

  async getValidPlotCount(where): Promise<any> {
    return this.getPlotStats({
      farm: where,
      polygons: this.validPolygonExists,
    });
  }

  async getInvalidPlotCount(where): Promise<any> {
    return this.getPlotStats({
      farm: where,
      polygons: {
        some: {}, // Ensures there is at least one Polygon
        every: {
          areaCalculated: null, // Ensures every Polygon has null for areaCalculated
        },
      },
    });
  }

  async getNopolygonPlotCount(where): Promise<any> {
    return this.getPlotStats({
      farm: where,
      polygons: {
        none: {}, // Prisma trick for "no child of this type can exist"
      },
    });
  }

  async getSatellitePendingPlots(where): Promise<any> {
    return this.getPlotStats({
      farm: where,
      polygons: this.validPolygonExists,
      OR: [
        { satelliteAnalysis: { none: {} } }, // Prisma trick for "no child of this type can exist"
        { satelliteAnalysis: { every: { deforestationAreaHa: null } } },
      ],
    });
  }

  async getSatelliteAnalyzedPlotsWithRisk(where): Promise<any> {
    return this.getPlotStats({
      farm: where,
      satelliteAnalysis: {
        some: {
          OR: [{ deforestationRisk: 'medium' }, { deforestationRisk: 'high' }],
        },
      },
    });
  }

  async getSatelliteAnalyzedPlotsWithoutRisk(where): Promise<any> {
    return this.getPlotStats({
      farm: where,
      satelliteAnalysis: {
        some: { deforestationRisk: 'low' }, // Ensures there is at least one Satellite analysis
      },
    });
  }

  async getStats(filters: FarmsFilter): Promise<any> {
    let where = {
      organisation: filters.organisation,
      season: filters.seasonCode
        ? { shortCode: filters.seasonCode }
        : undefined,
      facility: { AND: [] },
    };
    where = this.farmFilters.addLocationFilters(filters, where, 'location');
    where = this.farmFilters.addLocationFilters(
      filters,
      where,
      'customLocation',
    );

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
    const plotsWithoutRisk = await this.getSatelliteAnalyzedPlotsWithoutRisk(
      where,
    );
    const polygonWarningsCount = await this.getPolygonWarningsStat(where);

    const plots = {
      total:
        noPolygonCount.count + invalidPlotCount.count + validPlotCount.count,
      noPolygons: noPolygonCount.count,
      invalidPolygons: invalidPlotCount.count,
      pendingAnalysis: pendingAnalysis.count,
      hasRisk: plotsWithRisk.count,
      noRisk: plotsWithoutRisk.count,
    };

    const plotsList = {
      noPolygons: noPolygonCount.list,
      invalidPolygons: invalidPlotCount.list,
      pendingAnalysis: pendingAnalysis.list,
      hasRisk: plotsWithRisk.list,
      noRisk: plotsWithoutRisk.list,
    };
    // Uncomment for easy debugging
    // console.log(plotsList);
    this.logger.log('warning count:', polygonWarningsCount);
    return {
      plots,
      farmCount: farmCountData,
      averagePolygonSize:
        sizeStats._avg.areaCalculated || sizeStats._avg.areaSizeManual, // * 0.85, // MH demo adjustment
      totalPolygonSizes:
        sizeStats._sum.areaCalculated || sizeStats._sum.areaSizeManual, // * 0.85, // MH demo adjustment
      genders: {
        female: genders.find((e) => e.gender === 'Female')?._count._all || 0,
        male: genders.find((e) => e.gender === 'Male')?._count._all || 0,
      },
      polygonWarningsCount,
    };
  }
}
