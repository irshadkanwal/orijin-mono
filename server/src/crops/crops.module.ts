import { Module } from '@nestjs/common';
import { CropvarietyService } from './cropvariety.service';
import { CropsService } from './crops.service';
import { CropsController } from './crops.controller';

@Module({
  imports: [],
  controllers: [CropsController],
  providers: [CropvarietyService, CropsService],
  exports: [CropvarietyService, CropsService],
})
export class CropsModule {}
