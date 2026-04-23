import { Module } from '@nestjs/common';
import { FacilitiesModule } from '../facilities/facilities.module';
import { PolygonUtilModule } from '../polygonUtil/polygonUtil.module';
import { CountItemService } from './countItem.service';
import { FarmStatsService } from './farm.stats.service';
import { FarmsController } from './farms.controller';
import { FarmsService } from './farms.service';
import { PlotsService } from './plots.service';
import { FarmFilters } from './farm.filters';
import { ChangesModule } from '../changes/changes.module';
import { GeodatasModule } from '../geodatas/geodatas.module';
import { SeasonsService } from '../seasons/seasons.service';

@Module({
  imports: [FacilitiesModule, PolygonUtilModule, ChangesModule, GeodatasModule],
  controllers: [FarmsController],
  providers: [
    FarmsService,
    FarmStatsService,
    PlotsService,
    CountItemService,
    FarmFilters,
    SeasonsService,
  ],
  exports: [FarmsService, PlotsService],
})
export class FarmsModule {}
