import { EntityOperationMetadata } from '../common/dto/types';
import { Injectable, Logger } from '@nestjs/common';
import {
  CertificationStatus,
  CreationStatus,
  Farm,
  FarmMinimal,
  ReviewStatus,
} from './models/farms.model';
import { FarmInputValues, FarmsDto, FarmsDtoCSv } from './dto/farms.dto';
import { PrismaService } from 'nestjs-prisma';
import { Certification } from '../certifications/models/certifications.model';
import { FacilitiesService } from '../facilities/facilities.service';
import { FacilityType } from '../facilities/models/facility.model';
import { locationParentInclude } from '../locations/locations.service';
import { FarmsFilter } from './dto/farms.filter.dto';
import { Facility, JsonPayload, Prisma } from '@prisma/client';
import { addPagination } from '../common/prisma.helper';
import { deepPlotIncludes, plotIncludes, PlotsService } from './plots.service';
import { getObjectDifferences } from '../common/comparisonUtil';
import { GetOneInput } from '../common/dto/paginationAndSorting.dto';
import {
  cleanCsvImportFields,
  isValidImportString,
  parseDateForImport,
  parseIntForInport,
} from '../common/service/AbstractService';
import { IEntityService } from '../common/dto/types';
import {
  FacilitiesDto,
  GeoCoordinateInput,
} from '../facilities/dto/facilities.dto';
import { FarmFilters } from './farm.filters';
import { ChangesService } from '../changes/changes.service';
import { Change } from '../changes/models/changes.model';

function getCertificationStatus(certs: Certification[]): CertificationStatus {
  if (certs && Array.isArray(certs)) {
    //TODO: not really enough, fix this up
    return certs.some((c) => c.status === CertificationStatus.Certified)
      ? CertificationStatus.Certified
      : CertificationStatus.NotCertified;
  }
  return CertificationStatus.NotCertified;
}

export interface GetOneFarmInput extends GetOneInput {
  seasonId?: string;
}

type FilteredData = {
  minimalData?: boolean;
};

const sortChanges = (changes: Change[]) => {
  return changes.sort(
    (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
  );
};

const groupChangesByObjectId = (changes: Change[]) => {
  const grouped = {};
  sortChanges(changes).forEach((curr) => {
    if (!grouped[curr.objectId]) {
      grouped[curr.objectId] = curr;
    }
  });
  return grouped;
};

@Injectable()
export class FarmsService
  implements IEntityService<Farm, Farm, FarmsDtoCSv, FarmsDto, FarmsFilter>
{
  logger = new Logger(FarmsService.name);

  constructor(
    private prisma: PrismaService,
    private facilitiesService: FacilitiesService,
    private plotsService: PlotsService,
    private farmFilters: FarmFilters,
    protected changes?: ChangesService,
  ) {}
  minimalIncludes = {
    season: {
      select: {
        shortCode: true,
      },
    },
    facility: {
      include: {
        coordinate: true,
      },
    },
    plots: {
      where: {
        deletedAt: null,
      },
      include: {
        polygons: {
          where: {
            active: true,
          },
        },
      },
    },
  };

  // For tables
  farmListIncludes = {
    facility: {
      include: {
        location: { include: { ...locationParentInclude } },
        customLocation: { include: { ...locationParentInclude } },
        mainContactPerson: true,
        coordinate: true,
      },
    },
    season: true,
    certifications: true,
    plots: {
      include: plotIncludes,
      where: {
        deletedAt: null,
      },
    },
    surveyResults: {
      //
      include: {
        survey: {
          include: { surveyQuestions: true },
        },
        surveyAnswers: true,
      },
    },
  };

  // For single farm view
  singleFarmIncludes = {
    ...this.farmListIncludes,
    incomingPayloads: true,
    plots: {
      include: deepPlotIncludes,
      where: {
        deletedAt: null,
      },
    },
    countItems: true,
  };

  convertMinimal(
    farm,
    mostRecentChange: Change,
    certs?: Certification[],
  ): FarmMinimal {
    return {
      id: farm.id,
      season: farm.season,
      facility: {
        id: farm.facility.id,
        name: farm.facility.name,
        shortCode: farm.facility.shortCode,
        coordinate: farm.facility.coordinate
          ? [
              farm.facility.coordinate.latitude,
              farm.facility.coordinate.longitude,
            ]
          : [],
      },
      plots: farm.plots,
      updatedAt: mostRecentChange?.startTime ?? farm.updatedAt,
      updatedBy: mostRecentChange?.updatedBy ?? '',
    };
  }

  convert(
    farm,
    mostRecentChange: { updatedBy?: string; startTime?: Date } = {},
    certs?: Certification[],
  ): Farm {
    return {
      ...farm,
      approvalStatus: farm.approvalStatus as ReviewStatus,
      creationStatus: farm.creationStatus as CreationStatus,
      //COMMENT THIS BACK IN WHEN WE START USING CERTIFICATIONS
      // certificationStatus: getCertificationStatus(farm.certifications || certs),
      certifications: certs,
      totalArea: farm.plots?.reduce(
        (acc, plot) =>
          // TODO: The polygon order is not guaranteed unless we sort it!
          acc + plot.polygons[plot.polygons.length - 1]?.areaCalculated,
        0,
      ),
      updatedAt: mostRecentChange?.startTime ?? farm.updatedAt,
      updatedBy: mostRecentChange?.updatedBy ?? '',
    };
  }

  async upsertAllPlots(plots, farmId, metadata) {
    if (!plots || plots.length === 0) {
      this.logger.debug('No plots to upsert for farm ' + farmId);
      return;
    }
    this.logger.debug(
      'Found plots to upsert: ' + plots.map((plot) => plot.shortCode),
      // plots,
    );

    // Add or update all the incoming plots
    if (plots?.length > 0) {
      for (const plot of plots) {
        // Synchronous on purpose, mostly to keep tests constant..
        await this.plotsService.upsert(
          {
            ...plot,
            farmId,
          },
          metadata,
        );
      }
    }
  }

  // TODO: Make all this generic! - see applyFilters(filters, where) in prisma.helper
  private convertFiltersToWhere = (
    filters: FarmsFilter,
  ): Prisma.FarmWhereInput => {
    if (!filters.organisation) {
      throw new Error('Search without organization not allowed');
    }
    let where: Prisma.FarmWhereInput = {
      organisation: filters.organisation,
      facility: { AND: [] },
      ...(filters.seasonCode
        ? {
            season: {
              shortCode: filters.seasonCode,
            },
          }
        : {}),
      plots: {},
    };

    if (filters.shortCode || filters.name || filters.text) {
      const AND = where.facility.AND as Prisma.FacilityWhereInput[];
      AND.push({
        OR: [
          {
            shortCode: {
              contains: filters.shortCode || filters.text,
              mode: 'insensitive',
            },
          },
          {
            name: {
              contains: filters.name || filters.text,
              mode: 'insensitive',
            },
          },
        ],
      });
    }

    // Add location filters
    where = this.farmFilters.addLocationFilters(filters, where, 'location');
    where = this.farmFilters.addLocationFilters(
      filters,
      where,
      'customLocation',
    );

    // Deforestation filters
    if (filters.deforestation) {
      if (filters.deforestation === 'OK') {
        where = {
          ...where,
          plots: {
            some: {
              satelliteAnalysis: {
                some: {
                  deforestationRisk: 'low',
                },
              },
            },
          },
        };
      } else if (filters.deforestation === 'RISK') {
        where = {
          ...where,
          plots: {
            some: {
              OR: [
                {
                  satelliteAnalysis: { some: { deforestationRisk: 'medium' } },
                },
                {
                  satelliteAnalysis: { some: { deforestationRisk: 'high' } },
                },
              ],
            },
          },
        };
      } else if (filters.deforestation === 'NOT_DONE') {
        where = {
          ...where,
          plots: {
            some: {
              satelliteAnalysis: { none: {} },
            },
          },
        };
      }
    }
    if (filters.polygonStatus) {
      if (filters.polygonStatus === 'OK') {
        where = {
          ...where,
          AND: [
            {
              plots: {
                every: {
                  polygons: {
                    some: {
                      active: true,
                      areaCalculated: { not: null },
                      polygonWarnings: { none: { fixed: false } },
                      polygonInteractionWarnings: { none: { fixed: false } },
                    },
                  },
                },
              },
            },
            // Not sure why removing this brings farms with no plots onboard, if using only the query above..
            {
              plots: {
                some: {},
              },
            },
          ],
        };
      }
      if (filters.polygonStatus === 'WARNINGS') {
        where = {
          ...where,
          plots: {
            some: {
              polygons: {
                some: {
                  active: true,
                  OR: [
                    {
                      polygonWarnings: {
                        some: {
                          fixed: false,
                        },
                      },
                    },
                    {
                      polygonInteractionWarnings: {
                        some: {
                          fixed: false,
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        };
      }
      if (filters.polygonStatus === 'FAILED') {
        where = {
          ...where,
          AND: [
            // Has some plots with polygons
            {
              plots: {
                some: {
                  polygons: {
                    some: {},
                  },
                },
              },
            },
            // ..but none of them have good polygons
            {
              plots: {
                every: {
                  polygons: {
                    every: {
                      active: false,
                    },
                  },
                },
              },
            },
          ],
        };
      }
      if (filters.polygonStatus === 'NONE') {
        where = {
          ...where,
          OR: [
            // No plots
            {
              plots: {
                none: {},
              },
            },
            // Plots, but no polygons
            {
              plots: {
                every: {
                  polygons: {
                    none: {},
                  },
                },
              },
            },
          ],
        };
      }
    }
    if (filters.updatedWithin) {
      const dates = {
        MONTH: 30,
        WEEK: 7,
        DAY: 1,
      };
      const dateAmount = dates[filters.updatedWithin];
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - dateAmount);
      where = {
        ...where,
        incomingPayloads: {
          some: {
            createdAt: { gte: cutoff },
          },
        },
      };
    }
    return where;
  };

  async getOne(params: GetOneFarmInput): Promise<Farm> {
    const farm = params.id
      ? await this.prisma.farm.findUnique({
          where: { id: params.id, organisation: params.org },
          include: this.singleFarmIncludes,
        })
      : params.shortCode && params.seasonId
      ? await this.prisma.farm.findFirst({
          where: {
            facility: {
              shortCode: params.shortCode,
              organisation: params.org,
            },
            seasonId: params.seasonId,
          },
          include: this.singleFarmIncludes,
        })
      : null;

    if (!farm) {
      return null;
    }

    const json = await this.findPayload(params.org, farm.facility.shortCode);
    if (json) {
      farm.incomingPayloads = json;
    }

    const mostRecentChanges: Change[] = await this.prisma.change.findMany({
      where: {
        objectType: 'Farm',
        objectId: farm.id,
      },
    });

    return farm //
      ? this.convert(
          farm,
          sortChanges(mostRecentChanges)[0],
          farm.certifications,
        )
      : null;
  }

  async getMany(
    filters?: FarmsFilter,
  ): Promise<{ data: Farm[]; count: number; chartData?: any }> {
    const data = await this.getManyImpl(filters, { minimalData: false });

    return {
      data: data.data as Farm[],
      count: data.count as number,
    };
  }

  async getManyImpl(
    filters?: FarmsFilter,
    filteredData: FilteredData = {
      minimalData: false,
    },
  ): Promise<{ data: Farm[] | FarmMinimal[]; count: number }> {
    const { sort, sortOrder } = filters || {};

    const args: Prisma.FarmFindManyArgs = {
      where: this.convertFiltersToWhere(filters),

      include: filteredData.minimalData
        ? this.minimalIncludes
        : this.farmListIncludes,
      orderBy: { facility: { shortCode: 'asc' } },
      ...addPagination(filters),
    };

    // TODO: Move to a generic place! Leave just the part where we translate the incoming filter names into a DB table
    if (sort && sortOrder) {
      const sortFields = sort.split(',');
      const sortOrderValues = sortOrder.split(',');

      args.orderBy = {};
      sortFields.forEach((field, index) => {
        args.orderBy[field] = sortOrderValues[index] as Prisma.SortOrder;

        if (field === 'name') {
          args.orderBy = {
            facility: {
              name: sortOrderValues[index] as Prisma.SortOrder,
            },
          };
        }

        if (field === 'id') {
          args.orderBy = {
            facility: {
              shortCode: sortOrderValues[index] as Prisma.SortOrder,
            },
          };
        }
      });
    }
    const [farms, count] = await this.prisma.$transaction([
      this.prisma.farm.findMany(args),
      this.prisma.farm.count({ where: args.where }),
    ]);
    const convertToMinimal = filteredData.minimalData;

    // Silly manual thing for now
    const mostRecentChanges = await this.prisma.change.findMany({
      where: {
        objectType: 'Farm',
        objectId: {
          in: farms.map((farm) => farm.id),
        },
      },
    });
    const changesByFarm = groupChangesByObjectId(mostRecentChanges);

    if (convertToMinimal) {
      return {
        data: farms.map((a) => this.convertMinimal(a, changesByFarm[a.id])),
        count,
      };
    }

    return {
      data: farms.map((a) => this.convert(a, changesByFarm[a.id])),
      count,
    };
  }

  // TODO: WIP - ORNG-760
  async update(
    farmId: string,
    changes: FarmsDto,
    metadata?: EntityOperationMetadata,
  ): Promise<Farm> {
    const {
      // seasonId, //
      // seasonCode,
      mainContactPerson,
      coordinate,
      location,
      customLocation,
      ...restOfFacilityValues
    } = changes.facilityValues;

    if (mainContactPerson) {
      // Note: without this, main contact person not updated properly (e.g. when doing farmInspection update)
      restOfFacilityValues.mainContactPersonId = mainContactPerson.id;
    }

    const { plots, seasonId, seasonCode, ...restOfFarmValues } =
      changes.farmValues;
    const existing = await this.getOne({
      id: changes.farmValues.id,
      org: changes.facilityValues.organisation,
    });

    let sId = seasonId;
    this.logger.log('seasonCode: ' + seasonCode + ' seasonId: ' + seasonId);

    // TODO: Oliko tarkotus bounccaa jos seasonCode ei löydy?
    if (seasonCode) {
      const season = await this.prisma.season.findUnique({
        where: {
          shortCode_organisation: {
            shortCode: seasonCode,
            organisation: changes.facilityValues.organisation,
          },
        },
      });
      if (!season) {
        throw Error('season not found ' + seasonCode);
      }
      sId = season.id;
    }

    const previousFacility = await this.prisma.facility.findUnique({
      where: { id: changes.facilityValues.id },
    });

    let coordinateId: string | undefined = undefined;
    if (coordinate || previousFacility?.coordinateId) {
      const existingCoordinate = previousFacility?.coordinateId
        ? await this.prisma.geoCoordinate.findUnique({
            where: { id: previousFacility?.coordinateId },
          })
        : undefined;

      if (
        // Exists and changed
        (existingCoordinate &&
          coordinate &&
          (new Prisma.Decimal(coordinate.latitude).comparedTo(
            existingCoordinate.latitude,
          ) !== 0 ||
            new Prisma.Decimal(coordinate.longitude).comparedTo(
              existingCoordinate.longitude,
            ) !== 0)) ||
        // ||
        // new Prisma.Decimal(coordinate.altitude).comparedTo(
        //   existingCoordinate.altitude,
        // ) !== 0
        // Does not exist
        (!existingCoordinate && coordinate)
      ) {
        const newCoordinate = await this.prisma.geoCoordinate.create({
          data: coordinate,
        });
        coordinateId = newCoordinate.id;
      }
    }

    const updatedFacility = await this.prisma.facility.update({
      data: {
        ...restOfFacilityValues,
        locationId: location?.id,
        customLocationId: customLocation?.id,
        coordinateId,
      },
      where: { id: changes.facilityValues.id },
    });

    if (this.changes) {
      const facilityDiffs = getObjectDifferences(
        previousFacility,
        updatedFacility,
        true,
      );
      await this.changes.populate(
        changes.facilityValues.id,
        'Facility',
        'update',
        metadata?.updatedBy ?? 'system',
        metadata?.operationType,
        facilityDiffs,
      );
    }

    const previousFarm = await this.prisma.farm.findUnique({
      where: { id: changes.farmValues.id },
    });

    const updatedFarm = await this.prisma.farm.update({
      data: {
        ...restOfFarmValues,
        ...(sId
          ? {
              season: {
                connect: { id: sId },
              },
            }
          : {}),
      },
      where: { id: changes.farmValues.id },
    });

    if (this.changes) {
      const farmDiffs = getObjectDifferences(previousFarm, updatedFarm, true);
      await this.changes.populate(
        changes.farmValues.id,
        'Farm',
        'update',
        metadata?.updatedBy ?? 'system',
        metadata?.operationType,
        farmDiffs,
      );
    }

    // TODO: Add all this in a transaction

    // Find shortCodes that are in existingPlots but not in plots
    const plotsToDelete = existing.plots.filter(
      (existingPlot) =>
        !plots.map((plot) => plot.shortCode).includes(existingPlot.shortCode),
    );
    if (plotsToDelete.length > 0) {
      this.logger.log(
        'Found plots to delete: ' + plotsToDelete.map((plot) => plot.shortCode),
      );
      await Promise.all(
        plotsToDelete.map(async (plotToDelete) => {
          this.logger.log('Deleting plot: ' + plotToDelete.shortCode);
          await this.plotsService.delete(plotToDelete, metadata);
        }),
      );
    }

    await this.upsertAllPlots(plots, farmId, metadata);

    const farmWithIncludes = await this.getOne({
      id: changes.farmValues.id,
      org: changes.facilityValues.organisation,
    });

    return this.convert(farmWithIncludes, null);
  }

  async create(
    body: FarmsDto,
    metadata?: EntityOperationMetadata,
  ): Promise<Farm> {
    const {
      seasonId, //
      seasonCode,
      plots,
      ...restOfFarmValues
    } = body.farmValues;
    const organisation = body.facilityValues.organisation;

    let sId = seasonId;

    if (seasonCode) {
      const season = await this.prisma.season.findUnique({
        where: {
          shortCode_organisation: {
            shortCode: seasonCode,
            organisation: organisation,
          },
        },
      });

      if (!season) {
        throw Error('season not found ' + seasonCode);
      }

      sId = season.id;
    }

    // TODO: Vois olla "set" tossa farm createssa myös, niin menis yhtenä transaktiona (?)
    // TODO: Voiko koskaan tulla sisään Farm jolla olis jo Facility?
    // TODO: Prisma ei tykkää jos tulee ylimääräsiä propseja, pitäis A) destructaa vain Facilityyn kuuluvat tai B) erottaa jo inputissa nämä 2 propsiks

    // const res = await this.prisma.$transaction(async (tx) => {
    body.facilityValues.type = FacilityType.Farm;
    const convertedFacility =
      await this.facilitiesService.connectDependenciesForCreateAndUpdate(
        body.facilityValues,
        false,
      );

    const createdFacility = await this.prisma.facility.create({
      // FIXME: why??? according to https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#nested-writes it should be a proper type
      data: convertedFacility as Omit<
        Prisma.FacilityCreateInput,
        'mainContactPerson'
      >,
    });

    if (this.changes) {
      const diff = getObjectDifferences({}, convertedFacility, true);
      await this.changes.populate(
        createdFacility.id,
        'Facility',
        'create',
        metadata?.updatedBy ?? 'system',
        metadata?.operationType,
        diff,
      );

      if (
        convertedFacility.mainContactPerson &&
        'create' in convertedFacility.mainContactPerson &&
        createdFacility.mainContactPersonId
      ) {
        await this.changes.populate(
          createdFacility.mainContactPersonId,
          'Person',
          'create',
          metadata?.updatedBy ?? 'system',
          metadata?.operationType,
          getObjectDifferences(
            {},
            convertedFacility.mainContactPerson.create,
            true,
          ),
        );
      }
    }

    // this.logger.log('Got facility', facility);

    const farm = await this.prisma.farm.create({
      data: {
        ...restOfFarmValues,
        organisation,
        season: sId
          ? {
              connect: { id: sId },
            }
          : undefined,
        facility: {
          connect: { id: createdFacility.id },
        },
      },
    });

    if (this.changes) {
      const diff = getObjectDifferences(
        {},
        { ...farm, facilityId: createdFacility.id },
        true,
      );
      await this.changes.populate(
        farm.id,
        'Farm',
        'create',
        metadata?.updatedBy ?? 'system',
        metadata?.operationType,
        diff,
      );
    }

    await this.upsertAllPlots(plots, farm.id, metadata);

    const farmWithIncludes = await this.getOne({
      id: farm.id,
      org: organisation,
    });
    return this.convert(farmWithIncludes, null);
  }

  async convertForImport(body: FarmsDtoCSv): Promise<FarmsDto> {
    delete body[''];
    const dto = new FarmsDto();
    const farm = new FarmInputValues();
    const fac = new FacilitiesDto();

    dto.farmValues = farm;
    dto.facilityValues = fac;

    //maxQuantityProcessedLimitRaw,yieldEstimateRaw,email,phone,
    // address?: Address;

    if (isValidImportString(body.mainContactPersonCode)) {
      const persons = await this.prisma.person.findMany({
        where: {
          AND: [
            {
              organisation: body.organisation,
            },
            {
              shortCode: body.mainContactPersonCode,
            },
          ],
        },
      });
      if (persons.length == 0) {
        throw Error('persons not found ' + body.mainContactPersonCode);
      }
      if (persons.length > 1) {
        throw Error('too many persons found ' + body.mainContactPersonCode);
      }
      fac.mainContactPersonId = persons[0].id;
    }

    if (isValidImportString(body.locationCode)) {
      const locs = await this.prisma.location.findMany({
        where: {
          AND: [
            {
              organisation: body.organisation,
            },
            {
              shortCode: body.locationCode,
            },
          ],
        },
      });
      if (locs.length == 0) {
        throw Error('location not found ' + body.locationCode);
      }
      if (locs.length > 1) {
        throw Error('too many locations found ' + body.locationCode);
      }
      fac.location = locs[0];
    }

    fac.name = body.name;
    fac.shortCode = body.shortCode;
    fac.areaTotalManual = parseIntForInport(body.areaTotalManual);
    fac.organisation = body.organisation;

    if (body.latitude && body.latitude.length > 0) {
      fac.coordinate = new GeoCoordinateInput();
      fac.coordinate.latitude = parseIntForInport(body.latitude);
      fac.coordinate.longitude = parseIntForInport(body.longitude);
      fac.coordinate.altitude = parseIntForInport(body.altitude);
    }
    // fac.mainContactPerson = parseIntForInport(body.areaTotalManual);

    farm.seasonCode = body.seasonCode;
    // farm.cultivationStartDate = parseDateForImport(body.cultivationStartDate);
    farm.contractDate = parseDateForImport(body.contractDate);
    if (body.registrationDate) {
      farm.registrationDate = parseDateForImport(body.registrationDate);
    }
    farm.certificationStartDate = parseDateForImport(
      body.certificationStartDate,
    );
    if (body.lastChemicalUseDate) {
      farm.lastChemicalUseDate = parseDateForImport(body.lastChemicalUseDate);
    }
    if (body.lastInspectionDate) {
      farm.lastInspectionDate = parseDateForImport(body.lastInspectionDate);
    }
    if (body.firstVisitDate) {
      farm.firstVisitDate = parseDateForImport(body.firstVisitDate);
    }
    farm.certificationStatus = body.certificationStatus as CertificationStatus;
    farm.approvalStatus = body.approvalStatus as ReviewStatus;
    farm.creationStatus = body.creationStatus as CreationStatus;

    return dto;
  }

  async upsertImport(
    body: FarmsDtoCSv,
    metadata?: EntityOperationMetadata,
  ): Promise<Farm> {
    const { shortCode, organisation, ...restOfValues } = body;

    cleanCsvImportFields(body);

    if (!body.shortCode) {
      throw Error('all imports need to have a shortcode');
    }

    const existingFarm = await this.prisma.farm.findFirst({
      where: {
        facility: {
          shortCode: shortCode,
          organisation: organisation,
        },
        season: {
          shortCode: body.seasonCode,
        },
      },
    });

    if (existingFarm) {
      const convertedInput = await this.convertForImport({
        ...body,
      });
      convertedInput.facilityValues.id = existingFarm.facilityId;
      convertedInput.farmValues.id = existingFarm.id;

      return this.update(existingFarm.id, convertedInput, metadata);
    }

    const convertedInput = await this.convertForImport({
      ...body,
    });
    return this.create(convertedInput);
  }

  delete(id: string): Promise<{ sucess: boolean }> {
    throw new Error('Method not implemented.');
  }

  // TODO: Move to a JSONPayload service or something..

  async findPayload(organisation, id, date = null): Promise<JsonPayload[]> {
    return this.prisma.jsonPayload.findMany({
      where: {
        organisation,
        entityId: id,
        createdAt: date
          ? {
              gte: date,
            }
          : undefined,
      },
    });
  }

  async storeIncomingJsonPayload(
    organisation,
    source,
    json,
    shortCode,
  ): Promise<string> {
    const payload = await this.prisma.jsonPayload.create({
      data: {
        organisation,
        source,
        payload: json,
        entityId: shortCode,
      },
    });
    return payload.id;
  }

  async updateIncomingJsonPayload(
    incomingPayloadId: string,
    farmId: string,
  ): Promise<string> {
    const payload = await this.prisma.jsonPayload.update({
      data: {
        Farm: { connect: { id: farmId } },
      },
      where: {
        id: incomingPayloadId,
      },
    });
    return payload.id;
  }
}
