import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { FirestoreFarmInspectionService } from './firestore.farm.inspection.service';
import * as util from 'node:util';

@Injectable()
export class FirestoreFarmInspectionGetterService {
  private logger = new Logger(FirestoreFarmInspectionGetterService.name);

  constructor(
    private httpService: HttpService,
    private farmInspectionService: FirestoreFarmInspectionService,
  ) {}

  async getFromV1Api(org, farmFirestoreId: string, preventDuplicates = true) {
    const response = await this.httpService.axiosRef.post(
      'https://us-central1-orijin-prod.cloudfunctions.net/entity/getEntity',
      {
        referenceObjectId: {
          id: farmFirestoreId,
          refcollection: 'farms',
        },
        userId: {
          id: 'RPgeSkgbHzeC1rANI7VFb5KUmD52', // salla at platformusers // PpFv37r2Sj8j17dDNkx7 = Salla at superusers
          refcollection: 'platformusers',
        },
        workspace: 'ltc_master24',
        organisation: 'ltc',
        configKey: 'ltc',
      },
    );

    const resultJson = response.data;
    // console.log(util.inspect(response.data, null, 99)); // Mega-json object

    await this.farmInspectionService.process(
      resultJson,
      org,
      preventDuplicates,
    );
    this.logger.log('Done');
  }
}
