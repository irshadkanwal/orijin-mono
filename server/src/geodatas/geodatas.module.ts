import { Module } from '@nestjs/common';
import { PolygonService } from './geopolygon.service';
import { GeodatasController } from './geodatas.controller';
import { PolygonWarningService } from './geopolygonwarnings.service';

@Module({
  imports: [],
  controllers: [GeodatasController],
  providers: [PolygonService, PolygonWarningService],
  exports: [PolygonService, PolygonWarningService],
})
export class GeodatasModule {}
