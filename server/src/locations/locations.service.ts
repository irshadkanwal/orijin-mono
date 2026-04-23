import { Injectable, Logger } from '@nestjs/common';
import {
  CustomTypeOrder,
  GlobalLocationTypeOrder,
  Location,
  LocationLevels,
  LocationMainType,
} from './models/locations.model';
import { LocationsDto } from './dto/locations.dto';
import { PrismaService } from 'nestjs-prisma';
import { Location as PrismaLocation, Prisma } from '@prisma/client';
import { LocationsFilter } from './dto/locations.filter.dto';
import { GetOneInput } from '../common/dto/paginationAndSorting.dto';
import { cleanCsvImportFields } from '../common/service/AbstractService';
import { IEntityService } from '../common/dto/types';
import { addPagination, parseFilters } from '../common/prisma.helper';
import { OrderDirection } from '../common/order/order-direction';
import { FarmsFilter } from '../farms/dto/farms.filter.dto';

function convert(prismaLocationClient: PrismaLocation): Location {
  return {
    ...prismaLocationClient,
  };
}

export const locationParentInclude = {
  // First
  parent: {
    include: {
      // Second
      parent: {
        include: {
          // Third
          parent: {
            include: {
              // Fourth
              parent: true,
            },
          },
        },
      },
    },
  },
};

@Injectable()
export class LocationsService
  implements
    IEntityService<
      PrismaLocation,
      Location,
      LocationsDto,
      LocationsDto,
      LocationsFilter
    >
{
  logger = new Logger(LocationsService.name);

  constructor(private prisma: PrismaService) {}
  private convertFiltersToWhere = (
    filters: LocationsFilter,
  ): Prisma.LocationWhereInput => {
    const { filters: filterFields } = parseFilters(filters);
    if (!filterFields.organisation) {
      throw new Error('Search without organization not allowed');
    }

    const where = {
      organisation: filterFields.organisation,
      AND: [],
    };
    if (filterFields.name || filterFields.shortCode) {
      where.AND.push({
        OR: [
          {
            name: {
              contains: filterFields.name,
              mode: 'insensitive',
            },
          },
          {
            shortCode: {
              contains: filterFields.shortCode,
              mode: 'insensitive',
            },
          },
        ],
      });
    }
    if (filterFields.type) {
      const types = filterFields.type.split(',');
      where.AND.push({
        type: {
          in: types,
          mode: 'insensitive',
        },
      });
    }

    if (filterFields.mainType) {
      where.AND.push({
        mainType: filterFields.mainType,
      });
    }

    return where;
  };
  async getOne(params: GetOneInput): Promise<Location> {
    if (params.id) {
      const locationById = await this.prisma.location.findUnique({
        where: { id: params.id, organisation: params.org },
        include: locationParentInclude,
      });
      return convert(locationById);
    }
    const locationByShortcode = await this.prisma.location.findMany({
      where: { shortCode: params.shortCode, organisation: params.org },
      include: locationParentInclude,
    });
    return convert(locationByShortcode[0]);
  }

  async getAllForFilterOptions(filters: LocationsFilter): Promise<Location[]> {
    const defaultOrderBy: any[] = [
      { mainType: OrderDirection.asc },
      { type: OrderDirection.asc }, // Type sorting to ensure correct hierarchy
    ];
    const whereClause = this.convertFiltersToWhere(filters);
    return this.prisma.location.findMany({
      orderBy: defaultOrderBy,
      include: { parent: true },
      where: whereClause,
    });
  }

  async getMany(
    filters: LocationsFilter = {},
  ): Promise<{ data: Location[]; count: number }> {
    const {
      pagination,
      sorting,
      filters: filterFields,
    } = parseFilters(filters);
    const locationWhereClause = this.convertFiltersToWhere(filterFields);
    const inputPagination = addPagination(pagination);
    const { sort, sortOrder } = sorting;
    const defaultOrderBy: any[] = [
      { mainType: OrderDirection.asc },
      { type: OrderDirection.asc }, // Type sorting to ensure correct hierarchy
    ];

    const orderBy = sort
      ? [
          { [sort]: sortOrder || OrderDirection.desc },
          { mainType: OrderDirection.asc },
        ]
      : defaultOrderBy;
    const [data, count] = await this.prisma.$transaction([
      this.prisma.location.findMany({
        where: locationWhereClause,
        orderBy: orderBy,
        include: { parent: true }, // NOTE: Fetches only 1 layer of parents!
        ...inputPagination,
      }),
      this.prisma.location.count({
        where: locationWhereClause,
      }),
    ]);

    return {
      data: data,
      count: count,
    };
  }

  async create(body: LocationsDto): Promise<Location> {
    // this.logger.log(`Creating ${body.type} / ${body.shortCode} / ${body.name}`);

    const { parent, parentCode, ...values } = body;
    let parentId: string = values.parentId;

    delete values.parentId;
    try {
      if (parentCode && parentCode.length > 0) {
        const parent = await this.prisma.location.findMany({
          where: {
            AND: [
              { organisation: body.organisation },
              { shortCode: parentCode },
            ],
          },
        });
        if (parent.length === 0) {
          throw Error(`parent not found with: ${parentCode}.`);
        }
        parentId = parent[0].id;
      }

      return convert(
        await this.prisma.location.create({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          data: {
            ...values,
            parent:
              parent || parentId
                ? { connect: { id: parent?.id || parentId } }
                : undefined,
          },
          include: locationParentInclude,
        }),
      );
    } catch (err) {
      this.logger.warn(JSON.stringify(err));
      this.logger.warn(err);
      this.logger.warn(body);
      if (
        err.name === 'PrismaClientKnownRequestError' &&
        err.code === 'P2002' &&
        err.meta.target[0] === 'shortCode'
      ) {
        return await this.getOne({
          shortCode: body.shortCode,
          org: body.organisation,
        });
      } else {
        throw err;
      }
    }
  }

  async update(id: string, body: LocationsDto): Promise<Location> {
    this.logger.log(`Updating ${body.type} / ${body.shortCode}`);
    const { parentId, name, shortCode, type } = body;

    const isDistrict = type === LocationLevels.DISTRICT;
    const parentUpdate = isDistrict
      ? { disconnect: true }
      : parentId
      ? { connect: { id: parentId } }
      : undefined;

    return convert(
      await this.prisma.location.update({
        where: { id: id },
        data: {
          name,
          shortCode,
          type,
          parent: parentUpdate,
        },
        include: locationParentInclude,
      }),
    );
  }

  async delete(id: string): Promise<{ sucess: boolean }> {
    this.logger.log(`Deleting ${id}`);
    await this.prisma.location.delete({ where: { id } });
    return { sucess: true };
  }

  async getCustomizedMany(where: any): Promise<Location[]> {
    return this.prisma.location.findMany({
      where,
    });
  }

  async upsertImport(body: LocationsDto): Promise<Location> {
    const { shortCode, organisation, ...restOfValues } = body;

    cleanCsvImportFields(body);

    if (!body.shortCode) {
      this.logger.error(body);
      throw Error('all imports need to have a shortcode');
    }
    const existing = await this.prisma.location.findUnique({
      where: {
        shortCode: shortCode,
        organisation: organisation,
        id: undefined,
      },
    });

    if (existing) {
      return this.update(existing.id, {
        ...existing,
        ...body,
      });
    }
    // console.log('before conversion', body);

    return this.create(body);
  }

  async getDescendantLocations(locationId: string): Promise<string[]> {
    const descendants = await this.prisma.location.findMany({
      where: {
        OR: [
          { id: locationId },
          { parentId: locationId },
          {
            parent: {
              parentId: locationId,
            },
          },
          {
            parent: {
              parent: {
                parentId: locationId,
              },
            },
          },
        ],
      },
      select: {
        id: true,
      },
    });

    return descendants.map((location) => location.id);
  }

  async getFarmsPerLocation(
    organisation: string,
    filters: FarmsFilter,
  ): Promise<any> {
    let custom = true;
    let locations = await this.prisma.location.findMany({
      where: {
        organisation,
        type: {
          in: ['Zone', 'Region'],
        },
      },
    });

    // If no custom locations exist for org
    if (locations.length === 0) {
      custom = false;
      locations = await this.prisma.location.findMany({
        where: {
          organisation,
          type: {
            in: ['District', 'SubCounty'],
          },
        },
      });
    }

    const locationCounts = await Promise.all(
      locations.map(async (location) => {
        // Fetch descendant locations for each location
        const descendantLocationIds = await this.getDescendantLocations(
          location.id,
        );

        // Fetch facilities that are in the descendant locations
        const facilities = await this.prisma.facility.findMany({
          where: {
            organisation,
            locationId: !custom ? { in: descendantLocationIds } : undefined,
            customLocationId: custom
              ? { in: descendantLocationIds }
              : undefined,
            farm: {
              season: filters.seasonCode
                ? { shortCode: filters.seasonCode }
                : undefined,
            },
          },
          select: {
            id: true,
          },
        });

        // Get unique facility IDs
        const uniqueFacilityIds = new Set(
          facilities.map((facility) => facility.id),
        );

        return {
          locationId: location.id,
          locationName: location.name,
          farmCount: uniqueFacilityIds.size,
          level: location.type,
        };
      }),
    );

    // Group the results by District and SubCounty
    const result = locationCounts.reduce((acc, locationCount) => {
      if (
        locationCount.level === 'District' ||
        locationCount.level === 'SubCounty' ||
        locationCount.level === 'Zone' ||
        locationCount.level === 'Region'
      ) {
        if (!acc[locationCount.level]) {
          acc[locationCount.level] = [];
        }
        acc[locationCount.level].push({
          locationId: locationCount.locationId,
          locationName: locationCount.locationName,
          farmCount: locationCount.farmCount,
        });
      }
      return acc;
    }, {});

    return result;
  }

  async getStats(): Promise<{
    data: { totalCount: number; countsByLevel: Record<LocationLevels, number> };
  }> {
    const locations = await this.prisma.location.findMany();

    const countsByLevel = {
      [LocationLevels.DISTRICT]: 0,
      [LocationLevels.PARISH]: 0,
      [LocationLevels.VILLAGE]: 0,
      [LocationLevels.SUB_COUNTY]: 0,
    };

    locations.forEach((location) => {
      if (location.type in countsByLevel) {
        countsByLevel[location.type]++;
      }
    });

    const totalCount = locations.length;

    return { data: { totalCount, countsByLevel } };
  }
}
