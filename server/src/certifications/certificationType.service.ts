import { Injectable, Logger } from '@nestjs/common';
import { CertificationType } from './models/certifications.model';
import { CertificationTypeDto } from './dto/certifications.dto';
import { PrismaService } from 'nestjs-prisma';
import { CertificationType as PrismaCertification } from '@prisma/client';
import AbstractService from '../common/service/AbstractService';
import { StandardFilterDto } from '../common/dto/paginationAndSorting.dto';
import { CertificationTypeDtoCsv } from './dto/certificationType.dto';

@Injectable()
export class CertificationTypeService extends AbstractService<
  PrismaCertification,
  CertificationType,
  CertificationTypeDtoCsv,
  CertificationTypeDto,
  CertificationTypeDto,
  StandardFilterDto
> {
  logger = new Logger(CertificationTypeService.name);

  constructor(protected prisma: PrismaService) {
    super(prisma, prisma.certificationType as any);
  }
}
