import { Module } from '@nestjs/common';
import { GeocledianApiService } from './geocledianApi.service';
import { HttpModule } from '@nestjs/axios';
import { GeocledianService } from './geocledian.service';
import { FarmsModule } from '../farms/farms.module';
import { GeocledianController } from './geocledian.controller';

@Module({
  imports: [HttpModule, FarmsModule],
  providers: [GeocledianService, GeocledianApiService],
  controllers: [GeocledianController],
  exports: [GeocledianService],
})
export class GeocledianModule {}
