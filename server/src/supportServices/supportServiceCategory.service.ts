import { Injectable, Logger } from '@nestjs/common';
import { SupportServiceCategory } from './models/supportService.model';
import { PrismaService } from 'nestjs-prisma';
import {
  CreateSupportServiceCategoryDto,
  CreateSupportServiceCategoryDtoConnected,
  CreateSupportServiceCategoryDtoCsv,
} from './dto/createSupportServiceCategory.dto';
import { SupportingServiceCategory as PrismaSupportingServiceCategory } from '.prisma/client';
import AbstractService from '../common/service/AbstractService';
import { SupportingServiceCategoryFilterDto } from './dto/supportingServiceCategory.filter.dto';
import { PaginationAndSortingOutputDto } from '../common/dto/paginationAndSorting.dto';
import { SupportServiceCategoryFilterDto } from './dto/supportServiceCategory.filter.dto';
import { addPagination, parseFilters } from '../common/prisma.helper';
import { Prisma } from '@prisma/client';

@Injectable()
export class SupportServiceCategoryService extends AbstractService<
  PrismaSupportingServiceCategory,
  SupportServiceCategory,
  CreateSupportServiceCategoryDtoCsv,
  CreateSupportServiceCategoryDto,
  CreateSupportServiceCategoryDtoConnected,
  SupportingServiceCategoryFilterDto
> {
  logger = new Logger(SupportServiceCategoryService.name);

  constructor(protected prisma: PrismaService) {
    super(prisma, prisma.supportingServiceCategory as any);
  }

  public standardInclude() {
    return { supportingServiceCategoryType: true };
  }

  async connectDependenciesForCreateAndUpdate(
    body: CreateSupportServiceCategoryDto,
    isUpdate: boolean,
  ): Promise<CreateSupportServiceCategoryDtoConnected> {
    const {
      supportingServiceCategoryTypeId,
      supportingServiceCategoryTypeCode,
      service,
      ...rest
    } = body;

    const serviceId = service ? service : supportingServiceCategoryTypeId;

    const deps = await this.prisma.supportingServiceCategoryType.findMany({
      where: {
        AND: [
          { organisation: body.organisation },
          {
            OR: [
              { id: serviceId },
              { shortCode: supportingServiceCategoryTypeCode },
            ],
          },
        ],
      },
    });

    if (deps.length === 0) {
      throw new Error(
        `supportingServiceCategoryType not found for code ${
          supportingServiceCategoryTypeId || supportingServiceCategoryTypeId
        } ${body.organisation}`,
      );
    }

    return {
      ...rest,
      supportingServiceCategoryType: {
        connect: { id: deps[0].id },
      },
    } as CreateSupportServiceCategoryDtoConnected;
  }

  convertModel(
    prismaType: PrismaSupportingServiceCategory,
  ): SupportServiceCategory {
    return {
      ...(prismaType as any as SupportServiceCategory),
      //TODO: SM need to fix all these types
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      service: prismaType.supportingServiceCategoryType,
    };
  }

  private convertFiltersToWhere = (
    filterFields: SupportServiceCategoryFilterDto,
  ): Prisma.SupportingServiceCategoryWhereInput => {
    const { shortCode, organisation, categoryType } = filterFields;
    if (!organisation) {
      throw new Error('Search without organisation not allowed');
    }
    const decodedSearchTerm = shortCode
      ? decodeURIComponent(shortCode).trim()
      : undefined;

    const where: Prisma.SupportingServiceCategoryWhereInput = {
      organisation: filterFields.organisation,
      deletedAt: null,
      OR: [],
    };

    if (decodedSearchTerm) {
      where.OR.push({
        name: {
          contains: decodedSearchTerm,
          mode: Prisma.QueryMode.insensitive,
        },
      });
      where.OR.push({
        shortCode: {
          contains: decodedSearchTerm,
          mode: Prisma.QueryMode.insensitive,
        },
      });
    }

    if (where.OR.length === 0) {
      delete where.OR;
    }

    if (categoryType) {
      const categoryTypes = decodeURIComponent(categoryType).split(',');
      where.supportingServiceCategoryType = {
        OR: categoryTypes.map((categoryTypeField) => ({
          OR: [
            { name: { equals: categoryTypeField, mode: 'insensitive' } },
            { shortCode: { equals: categoryTypeField, mode: 'insensitive' } },
          ],
        })),
      };
    }
    console.log('where: ----------', where);
    return where;
  };

  async getMany(
    filters: SupportServiceCategoryFilterDto,
  ): Promise<PaginationAndSortingOutputDto<SupportServiceCategory>> {
    const {
      pagination,
      sorting,
      filters: filterFields,
    } = parseFilters(filters);
    const { sort, sortOrder } = sorting;
    const inputPagination = addPagination(pagination);

    const orderBy = sort
      ? [{ [sort]: sortOrder || 'asc' }]
      : this.getDefaultOrderBy();

    // const args: Prisma.SupportingServiceCategoryTypeFindManyArgs = {
    console.log(this.convertFiltersToWhere(filterFields));
    const args: any = {
      where: this.convertFiltersToWhere(filterFields),
      orderBy: orderBy,
      include: this.standardInclude(),
      ...inputPagination,
    };
    // const items = await this.prismaDelegate.findMany(arg0);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const [data, count] = await this.prisma.$transaction([
      this.prisma.supportingServiceCategory.findMany(args),
      this.prisma.supportingServiceCategory.count({ where: args.where }),
    ]);
    // return { data, count };

    return {
      data: data.map(this.convertModel),
      count: count,
    };
  }
}
