import { Module } from '@nestjs/common';
import { PaymentTransactionsService } from './paymentTransactions.service';
import { PaymentTransactionsController } from './paymentTransactions.controller';
import { ChangesModule } from '../changes/changes.module';

@Module({
  imports: [ChangesModule],
  controllers: [PaymentTransactionsController],
  providers: [PaymentTransactionsService],
  exports: [PaymentTransactionsService],
})
export class PaymentTransactionsModule {}
