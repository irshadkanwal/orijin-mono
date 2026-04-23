import { Injectable, Logger } from '@nestjs/common';
import { Farm, Plot as PrismaPlot, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { EntityOperationMetadata } from 'src/common/dto/types';
import { ChangesService } from '../changes/changes.service';
import { getObjectDifferences } from '../common/comparisonUtil';
import { PolygonService } from '../geodatas/geopolygon.service';
import { Polygon } from '../geodatas/models/geodatas.model';
import { PolygonUtilService } from '../polygonUtil/polygonUtil.service';
import { PlotDto, PlotDtoConnected, PlotDtoCsv } from './dto/farms.dto';
import { PlotsFilter } from './dto/plots.filter.dto';
import { Plot, PlotCoordinateSources, PlotType } from './models/plots.model';
import { PolygonWarningService } from '../geodatas/geopolygonwarnings.service';
import { SQUARE_METER_TO_HECTARES_MULTIPLIER } from '../common/constants';
import AbstractService, {
  parseBooleanForImport,
  parseDateForImport,
  parseIntForInport,
} from '../common/service/AbstractService';
import { addPagination } from '../common/prisma.helper';

function convert(prismaPlotClient: any): Plot {
  return {
    ...prismaPlotClient,
    type: prismaPlotClient.type as PlotType,
  };
}

export const plotIncludes = {
  polygons: {
    include: {
      polygonWarnings: true,
      polygonInteractionWarnings: true,
    },
  },
  satelliteAnalysis: true,
};

export const deepPlotIncludes = {
  ...plotIncludes,
  plotCountItems: {
    where: {
      deletedAt: null,
    },
  },
  polygons: {
    include: {
      polygonWarnings: true,
      polygonInteractionWarnings: {
        include: {
          polygons: {
            include: {
              plot: true,
            },
            where: {
              active: true,
              deletedAt: null,
              plot: {
                deletedAt: null,
              },
            },
          },
        },
      },
    },
  },
};

@Injectable()
export class PlotsService extends AbstractService<
  PrismaPlot,
  Plot,
  PlotDtoCsv,
  PlotDto,
  PlotDtoConnected,
  PlotsFilter
> {
  logger = new Logger(PlotsService.name);

  constructor(
    protected prisma: PrismaService,
    private polygonUtilService: PolygonUtilService,
    private polygonService: PolygonService,
    private polygonWarningService: PolygonWarningService,
    protected changes?: ChangesService,
  ) {
    super(prisma, prisma.plot as any);
  }

  // CRUD

  async getSeasonByFarmId(farmId) {
    const farm = await this.prisma.farm.findFirst({
      where: { id: farmId },
    });
    return farm.seasonId;
  }

  async getOne(id: string | any): Promise<any> {
    const plot = await this.prisma.plot.findUnique({
      where: { id: id },
      include: plotIncludes,
    });
    if (!plot) {
      throw new Error('Plot not found ' + id);
    }
    return convert(plot);
  }

  async getMany(filters: PlotsFilter): Promise<any> {
    // Check for the first scenario
    if (!filters.farmId && !filters.farmShortcode && !filters.organisation) {
      throw new Error(
        'Cannot search plots without a farm identifier, organisation, or farm shortcode',
      );
    }

    // Build the where clause
    const where: Prisma.PlotWhereInput = {
      shortCode: filters.shortCode ?? undefined,
      deletedAt: null,
      farm: {
        ...(filters.organisation
          ? {
              organisation: {
                equals: filters.organisation,
              },
            }
          : {}),
        ...(filters.farmId ? { id: filters.farmId } : {}),
        facility: filters.farmShortcode
          ? {
              shortCode: {
                equals: filters.farmShortcode,
              },
            }
          : undefined,
      },
    };

    // Construct pagination and sorting args (adjust as needed)
    const sorting = { sort: 'createdAt', sortOrder: 'asc' }; // Example sorting

    const orderBy = sorting.sort
      ? [{ [sorting.sort]: sorting.sortOrder || 'asc' }]
      : undefined;

    const args: Prisma.PlotFindManyArgs = {
      where,
      orderBy,
      include: plotIncludes, // Ensure `plotIncludes` is properly defined
      ...addPagination(filters),
    };

    // Execute the query and count in a transaction
    const [data, count] = await this.prisma.$transaction([
      this.prisma.plot.findMany(args),
      this.prisma.plot.count({ where: args.where }),
    ]);

    return data.map((a) => convert(a)); // Ensure `convert` is properly defined
  }

  async autofixAndStorePolygons(
    polygonCoordinates: number[][],
    polygonSource: PlotCoordinateSources,
    plotShortCode: string,
    skipStoringOriginal = false, // When re-running autofixes
  ) {
    // this.logger.log(
    //   'Starting autofix for polys from ' + polygonSource,
    //   polygonCoordinates,
    // );

    if (!polygonCoordinates) return null;

    const { completedPolygon, polygonWarnings, areaAsSquareMeters } =
      this.polygonUtilService.completePolygonAndGetWarnings(
        polygonCoordinates,
        polygonSource,
        plotShortCode,
      );

    const originalAndFixed = [];
    originalAndFixed.push({
      source: polygonSource,
      coordinates: completedPolygon,
      polygonWarnings: { create: polygonWarnings },
      areaCalculated: areaAsSquareMeters * SQUARE_METER_TO_HECTARES_MULTIPLIER,
      active: false,
    });

    if (polygonWarnings.length === 0) {
      // All good, early exit
      originalAndFixed[0].active = true;
      this.logger.debug(`Polygon autofix was not needed for ${plotShortCode}`);
    } else {
      // Not good, trying to fix
      try {
        const fixedData = this.polygonUtilService.fixPolygon(
          completedPolygon,
          polygonWarnings,
          polygonSource,
          plotShortCode,
        );

        if (fixedData) {
          originalAndFixed.push({
            source: 'AUTOFIX',
            coordinates: fixedData.fixedCoordinates,
            areaCalculated:
              fixedData.areaAsSquareMetersAfterFix *
              SQUARE_METER_TO_HECTARES_MULTIPLIER,
            polygonWarnings: { create: fixedData.warningsAfterFixAttempt },
            active: true, // TODO: Define which warnings are critical and prevent this from becoming active!
          });
          this.logger.log(
            `Polygon autofix done for farm ${plotShortCode}, coordinates:: ${
              fixedData.fixedCoordinates.length
            }, area: ${
              originalAndFixed[1].areaCalculated
            }, remaining warnings: ${fixedData.warningsAfterFixAttempt
              .filter((warn) => !warn.fixed)
              .map((warn) => warn.key)}`,
          );
        } else {
          this.logger.warn(
            `Not able to polygon autofix for plot ${plotShortCode}, remaining warnings: 
          ${JSON.stringify(polygonWarnings)}`,
          );
        }
      } catch (err2) {
        this.logger.warn(`Autofix failed for farm ${plotShortCode}`, {
          error: err2.message,
          polygonCoordinates,
        });
      }
    }
    if (skipStoringOriginal) {
      return originalAndFixed.slice(1, 2);
    }
    return originalAndFixed;
  }

  private async checkPolygonOverlapAndAddWarning(
    coordinates: Prisma.JsonValue,
    polygonId: string,
    allActivePolygons: Polygon[],
  ) {
    const overlappingResults =
      this.polygonUtilService.checkPolygonOverlappingForOrg(
        allActivePolygons,
        coordinates as number[][],
        polygonId,
      );

    const { polygons, outdatedWarnings } = overlappingResults || {};

    return {
      addWarning: polygons?.length > 0,
      polygon: polygons,
      outdatedWarnings,
    };
  }

  async upsert(
    payload: PlotDto,
    metadata?: EntityOperationMetadata,
    settings?: {
      skipInteractionWarnings?: boolean;
      skipStoringOriginal?: boolean;
    },
  ): Promise<Plot> {
    // console.log(payload);

    const {
      farmId, //
      farmCode,
      polygonCoordinates,
      polygonSource,
      organisation, // comes due to the AbstractService, but not used in a Plot (which cannot exist without a Farm)
      countItems,
      ...restOfValues
    } = payload;
    const shortCode = payload.shortCode;
    this.logger.debug('Upsert plot ' + shortCode);
    if (!farmId && !farmCode) {
      throw Error('Either farmId or farmCode has to be provided');
    }

    const sId = farmId;
    if (farmCode) {
      // TODO: Hakee Cropista mutta farmCodella?
      throw Error('this cant be working!');
      // sId = (
      //   await this.prisma.facility.findUnique({
      //     where: { shortCode: farmCode, organisation: payload.organisation },
      //   })
      // ).id;
    }
    // Try to find based on short code even when ID not provided
    if (!payload.id) {
      const existingPlots = await this.getMany({
        shortCode,
        farmId,
      });

      if (existingPlots.length > 0) {
        this.logger.debug(
          'Identified plot by shortCode "' +
            shortCode +
            '" even if plot ID was missing',
        );
        payload.id = existingPlots[0].id;
      }
    }

    let originalAndFixedPolygon;
    if (polygonCoordinates) {
      // TODO: Combine with polygonService and/or plot updating
      originalAndFixedPolygon = await this.autofixAndStorePolygons(
        polygonCoordinates,
        polygonSource,
        payload.shortCode,
        settings?.skipStoringOriginal,
      );
    }

    try {
      let res: Plot | PromiseLike<Plot>;
      if (payload.id) {
        // UPDATE
        this.logger.debug(
          'Updating plot ' + shortCode + ' for farm ' + (farmCode ?? farmId),
        );
        const existing = await this.getOne(payload.id);
        res = convert(
          await this.prisma.plot.update({
            data: {
              ...restOfValues,
              polygons: {
                updateMany: {
                  where: {
                    active: true,
                  },
                  data: {
                    active: false,
                  },
                },
                create: originalAndFixedPolygon ?? undefined,
              },
              farmId: sId,
              plotCountItems: countItems
                ? {
                    updateMany: {
                      where: {
                        deletedAt: null,
                      },
                      data: {
                        deletedAt: new Date(),
                      },
                    },
                    create: countItems,
                  }
                : undefined,
            },
            where: { id: payload.id },
            include: plotIncludes,
          }),
        );

        if (this.changes) {
          const diffs = getObjectDifferences(
            {
              ...existing,
              polygons: undefined,
              satelliteAnalysis: undefined,
              polygonCoordinates: undefined,
            },
            {
              ...res,
              // Exclude everything included by plotIncludes
              polygons: undefined,
              satelliteAnalysis: undefined,
              polygonCoordinates: undefined,
            },
            true,
          );
          await this.changes.populate(
            payload.id,
            'Plot',
            'update',
            metadata?.updatedBy ?? 'system',
            metadata?.operationType,
            diffs,
          );
        }
      } else {
        // CREATE
        this.logger.debug(
          'Creating plot ' + shortCode + ' for farm ' + (farmCode ?? farmId),
        );
        res = convert(
          await this.prisma.plot.create({
            data: {
              ...restOfValues,
              polygons: originalAndFixedPolygon
                ? { create: originalAndFixedPolygon }
                : undefined,
              plotCountItems: countItems //
                ? { create: countItems }
                : undefined,
              farmId: sId,
            },
            include: plotIncludes,
          }),
        );

        if (this.changes) {
          await this.changes.populate(
            res.id,
            'Plot',
            'create',
            metadata?.updatedBy ?? 'system',
            metadata?.operationType,
            getObjectDifferences(
              {},
              { ...res, polygons: undefined, satelliteAnalysis: undefined },
              true,
            ),
          );
        }
      }
      if (!settings?.skipInteractionWarnings) {
        await this.createInteractionWarningsForSinglePlot(res, organisation);
      }
      return res;
    } catch (err) {
      this.logger.error(payload);
      this.logger.error(err);
      throw err;
    }
  }

  async createInteractionWarningsForSinglePlot(
    plotResponse: Plot | PromiseLike<Plot>,
    organisation: string,
  ) {
    const plot = await plotResponse;
    const polygons = plot.polygons;
    const activePolygon = polygons.find((polygon) => polygon.active);
    const inactivePolygons = polygons.filter((polygon) => !polygon.active);
    const farmId = plot.farmId;
    const seasonId = await this.getSeasonByFarmId(farmId);

    const allActivePolygons: Polygon[] =
      await this.polygonService.getAllActivePolygonsForOrgAndSeason(
        organisation,
        seasonId,
      );

    //fix existing warnings for in-active polygons
    await this.createInteractionWarningsForPolygons(
      activePolygon,
      inactivePolygons,
      plot.shortCode,
      allActivePolygons,
    );
  }

  async createInteractionWarningsForPolygons(
    activePolygon: Polygon,
    inactivePolygons: Polygon[],
    plotShortCode: string,
    allActivePolygons: Polygon[],
  ) {
    const updates = inactivePolygons.map((polygon) =>
      this.polygonWarningService.fixInactivePolygonWarnings(polygon.id),
    );
    await Promise.all(updates);

    if (!activePolygon) {
      // this.logger.debug(
      //   'No active polygon found for ' + plotShortCode + ' , skipping interaction warnings',
      // );
      return;
    }

    const polygonInteractionWarnings =
      await this.checkPolygonOverlapAndAddWarning(
        activePolygon.coordinates,
        activePolygon.id,
        allActivePolygons,
      );

    if (polygonInteractionWarnings?.outdatedWarnings?.length) {
      const updates = polygonInteractionWarnings.outdatedWarnings.map(
        (warning) =>
          this.polygonWarningService.fixPolygonInteractionWarnings(warning),
      );
      await Promise.all(updates);
    }

    if (polygonInteractionWarnings?.addWarning) {
      this.logger.log(
        'Found ' +
          polygonInteractionWarnings.polygon.length +
          ' overlap warnings for ' +
          plotShortCode,
      );
      const interactionWarnings = polygonInteractionWarnings.polygon.map(
        (polygon) =>
          this.polygonUtilService.getPolygonInteractionWarnings(
            { createOverlapWarning: true },
            polygon.id,
            activePolygon.id,
          ),
      );

      const createWarningsPromise = interactionWarnings.map((warning) =>
        this.polygonWarningService.createPolygonInteractionWarnings(warning),
      );
      await Promise.all(createWarningsPromise);
    } else {
      this.logger.debug(
        'No New Warnings for polygon ' + plotShortCode + ', skipping',
      );
    }
  }

  async delete(
    plot: Plot | any,
    metadata?: EntityOperationMetadata,
  ): Promise<any> {
    const now = new Date();
    const changes = { deletedAt: now };
    await this.changes.populate(
      plot.id,
      'Plot',
      'delete',
      metadata?.updatedBy ?? 'system',
      metadata?.operationType,
      getObjectDifferences({}, changes, true),
    );

    await this.prisma.plot.update({
      where: { id: plot.id },
      data: changes,
    });

    return;
  }

  async findUnique(shortCode: string, organisation: string): Promise<any> {
    return await this.prisma.plot.findFirst({
      where: {
        shortCode: { equals: shortCode, mode: 'insensitive' },
        farm: {
          is: {
            organisation: organisation,
          },
        },
      },
      include: plotIncludes,
    });
  }

  async connectDependenciesForCreateAndUpdate(
    body: PlotDto,
    isUpdate: boolean,
  ): Promise<PlotDtoConnected> {
    const { farmId, farmCode, ...rest } = body;

    const storedFarm: Farm[] = await this.prisma.farm.findMany({
      where: {
        AND: [
          { organisation: body.organisation },
          {
            OR: [{ id: farmId }],
          },
          {
            facility: {
              is: {
                shortCode: farmCode,
              },
            },
          },
        ],
      },
    });

    if (storedFarm.length === 0) {
      throw new Error('contact not found for code ' + (farmCode || farmId));
    }

    return {
      ...rest,
      farm: {
        connect: { id: storedFarm[0].id },
      },
    } as PlotDtoConnected;
  }

  async convertForImport(body: PlotDtoCsv): Promise<PlotDto> {
    delete body.organisation;
    const res: PlotDto = {
      ...body,
      active: parseBooleanForImport(body.active),
      interCropped: parseBooleanForImport(body.interCropped),
      yieldEstimateRaw: parseIntForInport(body.yieldEstimateRaw),
      cultivationStartDate: parseDateForImport(body.cultivationStartDate),
      registrationDate: parseDateForImport(body.registrationDate),
      lastChemicalUseDate: parseDateForImport(body.lastChemicalUseDate),
      areaSizeManual: parseIntForInport(body.areaSizeManual),
    };
    return res;
  }
}
