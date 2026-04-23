import { Injectable, Logger } from '@nestjs/common';
import {
  CropVarietyDto,
  CropVarietyDtoConnected,
  CropVarietyDtoCsv,
} from './dto/crops.dto';
import { PrismaService } from 'nestjs-prisma';
import { Crop, CropVariety, Prisma } from '@prisma/client';
import { CropVarietyFilter } from './dto/crops.filter.dto';
import { CropVariety as PrismaCropVariety } from '.prisma/client';
import { PaginationAndSortingOutputDto } from '../common/dto/paginationAndSorting.dto';
import AbstractService from '../common/service/AbstractService';
import { addPagination } from '../common/prisma.helper';

@Injectable()
export class CropvarietyService extends AbstractService<
  PrismaCropVariety,
  CropVariety,
  CropVarietyDtoCsv,
  CropVarietyDto,
  CropVarietyDtoConnected,
  CropVarietyFilter
> {
  logger = new Logger(CropvarietyService.name);

  constructor(protected prisma: PrismaService) {
    super(prisma, prisma.cropVariety as any);
  }

  commonInclude = {
    crop: true,
  };

  public standardInclude() {
    return this.commonInclude;
  }

  // comment this code because we are using generic many functions

  async getMany(
    filters: CropVarietyFilter,
  ): Promise<PaginationAndSortingOutputDto<CropVariety>> {
    const { sort, sortOrder, name } = filters;

    const where: Prisma.CropVarietyWhereInput = {
      organisation: filters.organisation,
      shortCode: filters.shortCode || undefined,
      name: filters.name
        ? { contains: filters.name, mode: 'insensitive' }
        : undefined,
      crop: filters['crop.name'] //
        ? { name: filters['crop.name'] }
        : undefined,
    };
    const orderBy = sort ? [{ [sort]: sortOrder || 'asc' }] : [];

    const args: any = {
      where,
      orderBy: orderBy,
      include: this.commonInclude,
      ...addPagination(filters),
    };
    const items = await this.prisma.cropVariety.findMany(args);
    return {
      data: items.map(this.convertModel),
      count: items.length,
    };
  }

  protected getDefaultOrderBy() {
    return [
      {
        createdAt: 'desc',
      },
    ];
  }

  async connectDependenciesForCreateAndUpdate(
    body: CropVarietyDto,
    isUpdate: boolean,
  ): Promise<CropVarietyDtoConnected> {
    const { cropId, cropCode, ...rest } = body;
    const storedCrops: Crop[] = await this.prisma.crop.findMany({
      where: {
        AND: [
          { organisation: body.organisation },
          {
            OR: [{ id: cropId }, { shortCode: cropCode }],
          },
        ],
      },
    });

    if (storedCrops.length === 0) {
      throw new Error('Crop not found for code ' + (cropCode || cropId));
    }

    return {
      ...rest,
      crop: {
        connect: { id: storedCrops[0].id },
      },
    } as CropVarietyDtoConnected;
  }

  async convertForImport(body: CropVarietyDtoCsv): Promise<CropVarietyDto> {
    const res: CropVarietyDto = {
      ...body,
    };
    return res;
  }
}
