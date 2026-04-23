import { Injectable, Logger } from '@nestjs/common';
import { AbstractExporter } from './AbstractExporter';
import { Crop } from '../../crops/models/crops.model';
import CropV1 from '../v1entities/refdata/CropV1';
import { CropsService } from '../../crops/crops.service';
import { Meta } from '../v1entities/utis/types';
import { setupIdFields } from './../v1utils/utils';
import OrmProvider from '../v1services/OrmProvider';
import {ObjectId} from "../v1entities/utis/ObjectId";

@Injectable()
export class FirestoreCropsExporterService extends AbstractExporter<
  Crop,
  CropV1,
  CropsService
> {
  private logger = new Logger(FirestoreCropsExporterService.name);

  constructor(
    protected firestoreService: OrmProvider,
    protected myService: CropsService,
  ) {
    super(firestoreService, myService);
  }

  async transform(input: Crop, meta: Meta): Promise<CropV1> {
    const res = new CropV1();
    setupIdFields(res, input, meta);
    res.name = input.name;
    res.id.label = input.name;




    return res;
  }
}
