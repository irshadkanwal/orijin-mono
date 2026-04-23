import { Injectable, Logger } from '@nestjs/common';
import { SupportServiceCategoryTypeService } from '../../supportServices/supportServiceCategoryType.service';
import { AbstractExporter } from './AbstractExporter';
import { SupportServiceCategoryType } from '../../supportServices/models/supportService.model';
import TrainingTypeCategoryV1 from '../v1entities/services/TrainingTypeCategoryV1';
import { Meta } from '../v1entities/utis/types';
import OrmProvider from '../v1services/OrmProvider';

@Injectable()
export class FirestoreServicesCategoryTypeExporterService extends AbstractExporter<
  SupportServiceCategoryType,
  TrainingTypeCategoryV1,
  SupportServiceCategoryTypeService
> {
  private logger = new Logger(
    FirestoreServicesCategoryTypeExporterService.name,
  );

  constructor(
    protected firestoreService: OrmProvider,
    private myService: SupportServiceCategoryTypeService,
  ) {
    super(firestoreService, myService);
  }
  async transform(
    input: SupportServiceCategoryType,
    meta: Meta,
  ): Promise<TrainingTypeCategoryV1> {
    throw Error('not supported');
  }
}
