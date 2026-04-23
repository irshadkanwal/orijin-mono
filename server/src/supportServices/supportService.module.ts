import { Module } from '@nestjs/common';
import { SupportServiceCategoryService } from './supportServiceCategory.service';
import { SupportServiceController } from './supportService.controller';
import { SupportServiceActivityService } from './supportServiceActivity.service';
import { SupportServiceCategoryTypeService } from './supportServiceCategoryType.service';
import { SupportServiceActivityTypeService } from './supportServiceActivityType.service';
import { SupportServiceInputTypeService } from './supportServiceInputType.service';
import { SupportServiceActivityBeneficiaryService } from './supportServiceActivityBeneficiary.service';

@Module({
  imports: [],
  controllers: [SupportServiceController],
  providers: [
    SupportServiceCategoryTypeService,
    SupportServiceCategoryService,
    SupportServiceActivityService,
    SupportServiceActivityTypeService,
    SupportServiceInputTypeService,
    SupportServiceActivityBeneficiaryService,
  ],
  exports: [
    SupportServiceCategoryTypeService,
    SupportServiceCategoryService,
    SupportServiceActivityService,
    SupportServiceActivityTypeService,
    SupportServiceInputTypeService,
    SupportServiceActivityBeneficiaryService,
  ],
})
export class SupportServiceModule {}
