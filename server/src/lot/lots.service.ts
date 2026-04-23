import { Injectable, Logger } from '@nestjs/common';

import { LotsDto, LotsDtoConnected } from './dto/lot.dto';
import { PrismaService } from 'nestjs-prisma';
import { LotsFilter } from './dto/lots.filter.dto';
import { addPagination } from '../common/prisma.helper';
import { Lot as PrismaLot, Prisma } from '@prisma/client';
import AbstractService from '../common/service/AbstractService';
import { PaginationAndSortingOutputDto } from '../common/dto/paginationAndSorting.dto';
import { ChangesService } from '../changes/changes.service';
import { Lot } from './models/lot.model';

@Injectable()
export class LotsService extends AbstractService<
  PrismaLot,
  Lot,
  LotsDto,
  LotsDto,
  LotsDtoConnected,
  LotsFilter
> {
  logger = new Logger(LotsService.name);
  objectType: string | undefined = 'Lot';

  constructor(
    protected prisma: PrismaService,
    protected changes?: ChangesService,
  ) {
    super(prisma, prisma.lot as any, changes);
  }

  public standardInclude() {
    return {
      farm: {
        include: {
          facility: true,
        },
      },
      payments: true,
    };
  }

  async getMany(
    filters: LotsFilter,
  ): Promise<PaginationAndSortingOutputDto<Lot>> {
    const { sort, sortOrder, idCode } = filters;

    const where: Prisma.LotWhereInput = {
      organisation: filters.organisation,
      idCode: idCode
        ? { contains: idCode, mode: Prisma.QueryMode.insensitive }
        : undefined,
    };
    const orderBy = sort ? [{ [sort]: sortOrder || 'asc' }] : [];

    const args: any = {
      where,
      orderBy: orderBy,
      include: this.standardInclude(),
      ...addPagination(filters),
    };
    const items = await this.prisma.lot.findMany(args);
    return {
      data: items.map(this.convertModel),
      count: items.length,
    };
  }
}
