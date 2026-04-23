import { Injectable, Logger } from '@nestjs/common';
import { Facility, FacilityType } from './models/facility.model';
import {
  FacilitiesDto,
  FacilitiesDtoCsv,
  FacilityFilterDto,
} from './dto/facilities.dto';
import { PrismaService } from 'nestjs-prisma';
import { Facility as PrismaFacility, Prisma } from '@prisma/client';
import { Address } from '../locations/models/locations.model';
import AbstractService, {
  parseIntForInport,
} from '../common/service/AbstractService';
import { PersonsDto } from '../persons/dto/persons.dto';
import {
  PaginationAndSortingOutputDto,
  StandardFilterDto,
} from '../common/dto/paginationAndSorting.dto';
import { addPagination } from '../common/prisma.helper';
import { ChangesService } from '../changes/changes.service';

@Injectable()
export class FacilitiesService extends AbstractService<
  PrismaFacility,
  Facility,
  FacilitiesDtoCsv,
  FacilitiesDto,
  Prisma.FacilityUncheckedCreateInput,
  StandardFilterDto
> {
  logger = new Logger(FacilitiesService.name);
  objectType: string | undefined = 'Facility';

  constructor(
    protected prisma: PrismaService,
    protected changes: ChangesService,
  ) {
    super(prisma, prisma.facility as any, changes);
  }

  convert(prismaFacilityClient: PrismaFacility): Facility {
    return {
      ...prismaFacilityClient,
      address: prismaFacilityClient.address as Address,
      type: prismaFacilityClient.type as FacilityType,
      // areaTotalManual: prismaFacilityClient.areaTotalManual?.toNumber(),
    };
  }

  async findUnique(
    shortCode: string,
    organisation: string,
  ): Promise<PrismaFacility> {
    const existing: PrismaFacility = await this.prisma.facility.findUnique({
      where: {
        shortCode: shortCode,
        organisation: organisation,
        id: undefined,
        deletedAt: null,
      },
    });
    return existing;
  }

  async connectDependenciesForCreateAndUpdate(
    body: FacilitiesDto | FacilitiesDtoCsv,
    isUpdate: boolean,
  ): Promise<
    Prisma.FacilityUncheckedCreateInput & {
      mainContactPerson?: { connect: { id: string } } | { create: PersonsDto };
    }
  > {
    const {
      type, //
      areaTotalManual,
      ...restOfValues
    } = body;

    const csvInput = body as FacilitiesDtoCsv;
    const dtoInput = body as FacilitiesDto;

    let mainContactPerson = dtoInput.mainContactPerson;
    const mainContactPersonCode = csvInput.mainContactPersonCode;
    const mainContactPersonId = dtoInput.mainContactPersonId;
    const locationCode = csvInput.locationCode;
    const customLocationCode = csvInput.customLocationCode;
    let location = dtoInput.location;
    const locationId = dtoInput.locationId;
    const customLocationId = dtoInput.customLocationId;
    const address = dtoInput.address;
    const coordinate = dtoInput.coordinate;
    let customLocation = dtoInput.customLocation;

    delete restOfValues['mainContactPerson'];
    delete restOfValues['locationCode'];
    delete restOfValues['location'];
    delete restOfValues['customLocation'];
    delete restOfValues['customLocationCode'];
    delete restOfValues['address'];
    delete restOfValues['coordinate'];
    delete restOfValues['locationId'];
    delete restOfValues['customLocationId'];
    delete restOfValues['coordinateId'];
    delete restOfValues['mainContactPersonId'];

    if (customLocationCode) {
      const locs = await this.prisma.location.findMany({
        where: {
          AND: [
            { organisation: body.organisation },
            { shortCode: customLocationCode },
          ],
        },
      });

      if (locs.length === 0) {
        throw new Error('location not found for code ' + customLocationCode);
      }
      customLocation = locs[0];
    }

    if (locationCode) {
      const locs = await this.prisma.location.findMany({
        where: {
          AND: [
            { organisation: body.organisation },
            { shortCode: locationCode },
          ],
        },
      });

      if (locs.length === 0) {
        throw new Error('location not found for code ' + locationCode);
      }
      location = locs[0];
    }

    let mainContactPersonInput:
      | {
          connect: { id: string };
        }
      | {
          create: PersonsDto;
        } = undefined;

    if (mainContactPersonCode || mainContactPersonId) {
      const persons = await this.prisma.person.findMany({
        where: {
          AND: [
            { organisation: body.organisation },
            {
              OR: [
                { shortCode: mainContactPersonCode },
                { id: mainContactPersonId },
              ],
            },
          ],
        },
      });
      mainContactPerson = persons[0] as PersonsDto;
    }

    if (mainContactPerson) {
      if (mainContactPerson.id) {
        mainContactPersonInput = { connect: { id: mainContactPerson.id } };
      } else {
        mainContactPersonInput = { create: mainContactPerson };
      }
    }

    return {
      ...restOfValues,
      type: type,
      address: address as Prisma.JsonValue,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      mainContactPerson: mainContactPersonInput,
      location: location
        ? { connect: { id: location.id } }
        : locationId
        ? { connect: { id: locationId } }
        : undefined,
      customLocation: customLocation //
        ? { connect: { id: customLocation.id } }
        : customLocationId
        ? { connect: { id: customLocationId } }
        : undefined,
      areaTotalManual: areaTotalManual
        ? new Prisma.Decimal(areaTotalManual)
        : null,
      coordinate: coordinate ? { create: coordinate } : undefined,
    } as Prisma.FacilityUncheckedCreateInput;
  }

  async getMany(
    filters: FacilityFilterDto = {},
  ): Promise<PaginationAndSortingOutputDto<Facility>> {
    const { sort, sortOrder, name, type } = filters;
    const where = {
      organisation: filters.organisation,
      deletedAt: null,
      name: name
        ? { contains: name, mode: Prisma.QueryMode.insensitive }
        : undefined,
      type: type
        ? { contains: type, mode: Prisma.QueryMode.insensitive }
        : undefined,
      ...(filters.notFarm ? { type: { not: 'Farm' } } : {}),
    };

    const orderBy = sort
      ? [{ [sort]: sortOrder || 'asc' }]
      : this.getDefaultOrderBy();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const [data, count] = await this.prisma.$transaction([
      this.prisma.facility.findMany({
        where: where,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        orderBy: orderBy,
        include: {
          location: {
            include: {
              parent: {
                include: {
                  parent: {
                    include: {
                      parent: true,
                    },
                  },
                },
              },
            },
          },
          customLocation: {
            include: {
              parent: {
                include: {
                  parent: {
                    include: {
                      parent: true,
                    },
                  },
                },
              },
            },
          },
          mainContactPerson: true,
        },
        ...addPagination(filters),
      }),
      this.prismaDelegate.count({ where: where }),
    ]);
    // return { data, count };

    return {
      data: data.map(this.convertModel),
      count: count,
    };
  }

  async convertForImport(body: FacilitiesDtoCsv): Promise<FacilitiesDto> {
    delete body['parentFacilityCode'];
    delete body['locationParentParentCode'];
    delete body['parentLocationParentParentParent'];
    return {
      ...body,
      areaTotalManual: parseIntForInport(body.areaTotalManual),
    };
  }
}
