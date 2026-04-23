import { Injectable, Logger } from '@nestjs/common';
import { SupportServiceActivityService } from '../../supportServices/supportServiceActivity.service';
import { AbstractExporter } from './AbstractExporter';
import { SupportServiceActivity } from '../../supportServices/models/supportService.model';
import TrainingSessionV1 from '../v1entities/services/TrainingSessionV1';
import { Meta } from '../v1entities/utis/types';
import { setupIdFields } from './../v1utils/utils';
import OrmProvider from '../v1services/OrmProvider';

@Injectable()
export class FirestoreServicesActivityExporterService extends AbstractExporter<
  SupportServiceActivity,
  TrainingSessionV1,
  SupportServiceActivityService
> {
  private logger = new Logger(FirestoreServicesActivityExporterService.name);

  constructor(
    protected firestoreService: OrmProvider,
    private myService: SupportServiceActivityService,
  ) {
    super(firestoreService, myService);
  }
  async transform(
    input: SupportServiceActivity,
    meta: Meta,
  ): Promise<TrainingSessionV1> {
    const res = new TrainingSessionV1();
    setupIdFields(res, input, meta);

    throw Error('not supported');
    // res.operatedBy
    // res.name
    // res.
    //
    // const trainingType = new ObjectId('TODO', collectionKeys.trainingtypes);
    // trainingType.labelShort = 'TODO';
    // trainingType.label = 'TODO';
    // res.trainingType = trainingType;
    // return res;
  }
}
