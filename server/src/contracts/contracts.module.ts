import { Module } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';

@Module({
  imports: [],
  controllers: [ContractsController],
  providers: [ContractsService],
})
export class ContractsModule {}
