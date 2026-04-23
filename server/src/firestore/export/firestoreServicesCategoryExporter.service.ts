import { Injectable, Logger } from '@nestjs/common';
import { SupportServiceCategoryService } from '../../supportServices/supportServiceCategory.service';
import { AbstractExporter } from './AbstractExporter';
import { SupportServiceCategory } from '../../supportServices/models/supportService.model';
import TrainingTypeV1 from '../v1entities/services/TrainingTypeV1';
import { Meta } from '../v1entities/utis/types';
import { setupIdFields } from './../v1utils/utils';
import OrmProvider from '../v1services/OrmProvider';
import TrainingTypeCategoryV1 from '../v1entities/services/TrainingTypeCategoryV1';

@Injectable()
export class FirestoreServicesCategoryExporterService extends AbstractExporter<
  SupportServiceCategory,
  TrainingTypeV1,
  SupportServiceCategoryService
> {
  private logger = new Logger(FirestoreServicesCategoryExporterService.name);

  constructor(
    protected firestoreService: OrmProvider,
    protected myService: SupportServiceCategoryService,
  ) {
    super(firestoreService, myService);
  }
  async transform(
    input: SupportServiceCategory,
    meta: Meta,
  ): Promise<TrainingTypeV1> {
    // const res = new TrainingTypeCategoryV1();
    // setupIdFields(res, input, meta);
    // res.name = input.name;
    // res.id.label = input.name;
    // return res;
    throw Error('depricated');
  }
}
