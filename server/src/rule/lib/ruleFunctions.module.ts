import { Module } from '@nestjs/common';
import { RuleFunctionsService } from './ruleFunctions.service';
import { FarmsModule } from '../../farms/farms.module';

@Module({
  imports: [FarmsModule],
  providers: [RuleFunctionsService],
  exports: [RuleFunctionsService],
})
export class RuleFunctionsModule {}
