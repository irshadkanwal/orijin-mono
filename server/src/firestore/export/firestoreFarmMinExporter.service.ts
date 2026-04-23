import { Injectable, Logger } from '@nestjs/common';
import { FarmsService } from '../../farms/farms.service';
import { AbstractExporter } from './AbstractExporter';
import Farm_minV1 from '../v1entities/farms/Farm_minV1';
import { Farm, FarmMinimal } from '../../farms/models/farms.model';
import { Meta } from '../v1entities/utis/types';
import { setupIdFields } from './../v1utils/utils';
import OrmProvider from '../v1services/OrmProvider';

@Injectable()
export class FirestoreFarmMinExporterService extends AbstractExporter<
  FarmMinimal,
  Farm_minV1,
  FarmsService
> {
  private logger = new Logger(FirestoreFarmMinExporterService.name);

  constructor(
    protected firestoreService: OrmProvider,
    protected myService: FarmsService,
  ) {
    super(firestoreService, myService);
  }

  async getMany(organisation: string): Promise<FarmMinimal[]> {
    const inputs = await this.v2Service.getManyImpl(
      {
        organisation,
      },
      { minimalData: true },
    );
    return inputs.data as FarmMinimal[];
  }

  async transform(input: Farm, meta: Meta): Promise<Farm_minV1> {
    const res = new Farm_minV1();
    setupIdFields(res, input, meta);
    res.name = input.facility.name;
    return res as Farm_minV1;
  }
}
