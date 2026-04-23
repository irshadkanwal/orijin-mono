import { Injectable, Logger } from '@nestjs/common';

import {
  paymentTransactionsDto,
  paymentTransactionsDtoConnected
} from './dto/paymentTransactions.dto';
import { PrismaService } from 'nestjs-prisma';
import { PaymentTransactionsFilter } from './dto/paymentTransactions.filter.dto';
import { addPagination } from '../common/prisma.helper';
import { PaymentTransaction as PrismaPaymentTransaction, Prisma } from '@prisma/client';
import AbstractService, {
} from '../common/service/AbstractService';
import { PaginationAndSortingOutputDto } from '../common/dto/paginationAndSorting.dto';
import { ChangesService } from '../changes/changes.service';
import { PaymentTransaction } from './models/paymentTransaction.model';

@Injectable()
export class PaymentTransactionsService extends AbstractService<
PrismaPaymentTransaction,
  PaymentTransaction,
  paymentTransactionsDto,
  paymentTransactionsDto,
  paymentTransactionsDtoConnected,
  PaymentTransactionsFilter
> {
  logger = new Logger(PaymentTransactionsService.name);
  objectType: string | undefined = 'PaymentTransaction';

  constructor(
    protected prisma: PrismaService,
    protected changes?: ChangesService,
  ) {
    super(prisma, prisma.paymentTransaction as any, changes);
  }

  public standardInclude() {
    return {
      lot:true,
      farm: {
        include:{
          facility: true
        }
      },
    };
  }
  async getMany(
    filters: PaymentTransactionsFilter,
  ): Promise<PaginationAndSortingOutputDto<PaymentTransaction>> {
    const { sort, sortOrder, name } = filters;

    const where: Prisma.PaymentTransactionWhereInput = {
      organisation: filters.organisation,
      payeeFirstName: name
      ? { contains: name, mode: Prisma.QueryMode.insensitive }
      : undefined,
    };
    const orderBy = sort ? [{ [sort]: sortOrder || 'asc' }] : [];

    const args: any = {
      where,
      orderBy: orderBy,
      include: this.standardInclude(),
      ...addPagination(filters),
    };
    const items = await this.prisma.paymentTransaction.findMany(args);
    return {
      data: items.map(this.convertModel),
      count: items.length,
    };
  }
}
