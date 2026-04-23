import { Injectable, Logger } from '@nestjs/common';
import { AbstractExporter } from './AbstractExporter';
import { Meta } from '../v1entities/utis/types';
import { setupIdFields } from './../v1utils/utils';
import OrmProvider from '../v1services/OrmProvider';
import { CertificationTypeService } from '../../certifications/certificationType.service';
import { CertificationType } from '../../certifications/models/certifications.model';
import CertificationTypeV1 from '../v1entities/certification/CertificationTypeV1';

@Injectable()
export class FirestoreCertificationTypeExporterService extends AbstractExporter<
  CertificationType,
  CertificationTypeV1,
  CertificationTypeService
> {
  private logger = new Logger(FirestoreCertificationTypeExporterService.name);

  constructor(
    protected firestoreService: OrmProvider,
    protected myService: CertificationTypeService,
  ) {
    super(firestoreService, myService);
  }

  async transform(
    input: CertificationType,
    meta: Meta,
  ): Promise<CertificationTypeV1> {
    const res = new CertificationTypeV1();
    setupIdFields(res, input, meta);
    res.name = input.name;
    res.id.label = input.name;
    res.id.labelShort = input.shortCode;
    return res;
  }
}
