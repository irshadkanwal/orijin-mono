import { Injectable, Logger } from '@nestjs/common';
import { SupportServiceCategoryService } from '../../supportServices/supportServiceCategory.service';
import { AbstractExporter } from './AbstractExporter';
import { FirestoreService } from '../firestore.service';
import {
  SupportServiceActivityType,
  SupportServiceCategory,
} from '../../supportServices/models/supportService.model';
import TrainingTypeV1 from '../v1entities/services/TrainingTypeV1';
import { Meta } from '../v1entities/utis/types';
import { setupIdFields } from './../v1utils/utils';
import { SupportServiceActivityTypeService } from '../../supportServices/supportServiceActivityType.service';
import OrmProvider from "../v1services/OrmProvider";

@Injectable()
export class FirestoreServicesActivityTypeExporterService extends AbstractExporter<
  SupportServiceActivityType,
  TrainingTypeV1,
  SupportServiceActivityTypeService
> {
  private logger = new Logger(
    FirestoreServicesActivityTypeExporterService.name,
  );

  constructor(
    protected firestoreService: OrmProvider,
    protected myService: SupportServiceActivityTypeService,
  ) {
    super(firestoreService, myService);
  }
  async transform(
    input: SupportServiceCategory,
    meta: Meta,
  ): Promise<TrainingTypeV1> {
    const res = new TrainingTypeV1();
    setupIdFields(res, input, meta);
    res.name = input.name;
    res.type = input.type;
    res.id.label = input.name;

    return res;
  }
}
