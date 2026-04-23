import { Injectable, Logger } from '@nestjs/common';
import { SeasonsService } from '../../seasons/seasons.service';
import { Season } from '../../seasons/models/seasons.model';
import { AbstractExporter } from './AbstractExporter';
import { Meta } from '../v1entities/utis/types';
import { setupIdFields } from '../v1utils/utils';
import OrmProvider from '../v1services/OrmProvider';
import SeasonV1 from '../v1entities/refdata/SeasonV1';

@Injectable()
export class FirestoreSeasonExporterService extends AbstractExporter<
  Season,
  SeasonV1,
  SeasonsService
> {
  private logger = new Logger(FirestoreSeasonExporterService.name);

  constructor(
    protected firestoreService: OrmProvider,
    protected myService: SeasonsService,
  ) {
    super(firestoreService, myService);
  }

  async transform(input: Season, meta: Meta): Promise<SeasonV1> {
    const res = new SeasonV1();
    setupIdFields(res, input, meta);
    res.id.label = input.name;
    res.name = input.name;
    res.startDate = input.startsAt;
    res.endDate = input.endsAt;
    res.enabled = input.active;

    return res;
  }
}
