import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PaymentTransaction } from './models/paymentTransaction.model';
import { PaymentTransactionsService } from './paymentTransactions.service';
import { PaymentTransactionsFilter } from './dto/paymentTransactions.filter.dto';
import { PaginationAndSortingOutputDto, StandardFilterDto } from '../common/dto/paginationAndSorting.dto';

@Controller()
export class PaymentTransactionsController {
  constructor(private readonly paymentTransactionsService: PaymentTransactionsService) {}

  @Get(':org/payment-transactions')
  getPaymentTransactions(
    @Param('org') org: string,
    @Query() filters: StandardFilterDto,
  ): Promise<PaginationAndSortingOutputDto<PaymentTransaction>> {
    filters.organisation = org;
    return this.paymentTransactionsService.getMany(filters);
  }

  @Get(':org/payment-transactions/:id')
  getLot(@Param('org') org: string, @Param('id') id: string): Promise<PaymentTransaction> {
    return this.paymentTransactionsService.getOne(
      {
        id,
        org: org,
      }
    );
  }
}
