import { Module } from '@nestjs/common';
import { PolygonUtilService } from './polygonUtil.service';

@Module({
  imports: [],
  controllers: [],
  providers: [PolygonUtilService],
  exports: [PolygonUtilService],
})
export class PolygonUtilModule {}
