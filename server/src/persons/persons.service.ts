import { Injectable, Logger } from '@nestjs/common';
import { Person, PersonWithServiceActivities } from './models/persons.model';
import {
  PersonsDto,
  PersonsDtoConnected,
  PersonsDtoCsv,
} from './dto/persons.dto';
import { PrismaService } from 'nestjs-prisma';
import { PersonsFilter } from './dto/persons.filter.dto';
import { addPagination } from '../common/prisma.helper';
import { Person as PrismaPerson, Prisma } from '@prisma/client';
import { locationParentInclude } from '../locations/locations.service';
import AbstractService, {
  parseBooleanForImport,
  parseDateForImport,
} from '../common/service/AbstractService';
import { PaginationAndSortingOutputDto } from '../common/dto/paginationAndSorting.dto';
import { ChangesService } from '../changes/changes.service';

@Injectable()
export class PersonsService extends AbstractService<
  PrismaPerson,
  Person,
  PersonsDtoCsv,
  PersonsDto,
  PersonsDtoConnected,
  PersonsFilter
> {
  logger = new Logger(PersonsService.name);
  objectType: string | undefined = 'Person';

  constructor(
    protected prisma: PrismaService,
    protected changes?: ChangesService,
  ) {
    super(prisma, prisma.person as any, changes);
  }

  public standardInclude() {
    return {
      contacts: {
        include: {
          wallets: true,
        },
      },
      mainContactPersonFor: {
        include: {
          location: { include: { ...locationParentInclude } },
          customLocation: {
            include: { ...locationParentInclude },
          },
          coordinate: true,
          farm: true,
        },
      },
    };
  }

  public servicesActivitiesInclude() {
    return {
      ...this.standardInclude(),
      ServiceActivityBeneficiaries: {
        include: {
          supportingServiceActivity: {
            include: {
              supportingServiceActivityType: true,
              supportingServiceCategory: true,
              supportingServiceCategoryType: true,
              location: {
                include: {
                  facilities: {
                    include: {
                      mainContactPerson: true,
                    },
                  },
                  facilitiesCustom: {
                    include: {
                      mainContactPerson: true,
                    },
                  },
                },
              },
              serviceActivityLocations: {
                include: {
                  location: {
                    include: {
                      facilitiesCustom: {
                        include: {
                          mainContactPerson: true,
                        },
                      },
                      ...locationParentInclude,
                    },
                  },
                },
              },
              supportingServiceInputType: true,
            },
          },
          person: true,
        },
      },
    };
  }

  private convertFiltersToWhere = (
    filters: PersonsFilter,
  ): Prisma.PersonWhereInput => {
    if (!filters?.organisation) {
      throw new Error('Search without organisation not allowed');
    }
    const where: {
      organisation: string;
      mainContactPersonFor?: any;
    } = {
      organisation: filters.organisation,
    };

    if (filters.location) {
      const locations = decodeURIComponent(filters.location).split(',');
      const nameOrShortcode = (location) => ({
        OR: [
          { name: { equals: location, mode: 'insensitive' } },
          { shortCode: { equals: location, mode: 'insensitive' } },
        ],
      });
      where.mainContactPersonFor = { some: { AND: [] } };
      where.mainContactPersonFor.some.AND.push({
        OR: locations.map((location) => ({
          OR: [
            { location: nameOrShortcode(location) },
            { location: { parent: nameOrShortcode(location) } },
            {
              location: {
                parent: { parent: nameOrShortcode(location) },
              },
            },
            {
              location: {
                parent: {
                  parent: { parent: nameOrShortcode(location) },
                },
              },
            },
          ],
        })),
      });
    }

    if (filters.shortCode) {
      const [firstNamePart, lastNamePart] = filters.shortCode.split(' ');
      return {
        AND: [
          where,
          {
            OR: [
              {
                shortCode: {
                  contains: filters.shortCode,
                  mode: 'insensitive',
                },
              },
              {
                firstName: {
                  contains: filters.shortCode,
                  mode: 'insensitive',
                },
              },
              {
                lastName: {
                  contains: filters.shortCode || '',
                  mode: 'insensitive',
                },
              },
              {
                email: {
                  contains: filters.shortCode,
                  mode: 'insensitive',
                },
              },
              {
                AND: [
                  {
                    firstName: {
                      contains: firstNamePart,
                      mode: 'insensitive',
                    },
                  },
                  {
                    lastName: {
                      contains: lastNamePart || '', // Match if both first and last name are provided
                      mode: 'insensitive',
                    },
                  },
                ],
              },
            ],
          },
        ],
      };
    }

    return where;
  };

  async getMany(
    filters?: PersonsFilter,
  ): Promise<PaginationAndSortingOutputDto<Person>> {
    const args: Prisma.PersonFindManyArgs = {
      where: this.convertFiltersToWhere(filters),
      include: this.standardInclude(),
      orderBy: { createdAt: 'desc' },
      ...addPagination(filters),
    };

    const [data, count] = await this.prisma.$transaction([
      this.prisma.person.findMany(args),
      this.prisma.person.count({ where: args.where }),
    ]);
    return {
      data: data as Person[],
      count,
    };
  }

  async convertForImport(body: PersonsDtoCsv): Promise<PersonsDto> {
    //TODO: use .skip instead in the import files...
    delete body['contactPersonForFacility'];
    delete body['parentLocationParentParentParent'];
    delete body['parentLocationParentParent'];
    delete body['parentLocationParent'];
    delete body['VILLAGE'];
    delete body['parentLocation'];
    delete body['parentFacility'];
    delete body['name'];
    delete body['season'];

    const res: PersonsDto = {
      ...body,
      dateOfBirth: parseDateForImport(body.dateOfBirth),
      dateOfBirthApproximate: parseBooleanForImport(
        body.dateOfBirthApproximate,
      ),
    };
    return res;
  }

  async getCustomizedMany(where: any): Promise<Person[]> {
    return this.prisma.person.findMany({
      where,
    }) as Promise<Person[]>;
  }

  connectDependenciesForCreateAndUpdate(
    body: PersonsDtoCsv | PersonsDto,
    isUpdate: boolean,
  ): Promise<PersonsDtoConnected> {
    const personBody = body as PersonWithServiceActivities;

    //should do the actual linking here also...
    if (
      personBody.mainContactPersonFor &&
      personBody.mainContactPersonFor.length == 0
    ) {
      personBody.mainContactPersonFor = undefined;
    } else if (personBody.mainContactPersonFor) {
      //TODO: not sure if this will delink everything...
      personBody.mainContactPersonFor = undefined;
    }

    if (
      personBody.ServiceActivityBeneficiaries &&
      personBody.ServiceActivityBeneficiaries.length == 0
    ) {
      personBody.ServiceActivityBeneficiaries = undefined;
    } else if (personBody.ServiceActivityBeneficiaries) {
      personBody.ServiceActivityBeneficiaries = undefined;
    }

    //TODO: fix the types
    return body as any as Promise<PersonsDtoConnected>;
  }
}
