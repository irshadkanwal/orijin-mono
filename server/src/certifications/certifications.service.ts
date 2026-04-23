import { Injectable, Logger } from '@nestjs/common';
import { Certification } from './models/certifications.model';
import {
  CertificationsDto,
  CertificationsDtoConnected,
  CertificationsDtoCsv,
} from './dto/certifications.dto';
import { PrismaService } from 'nestjs-prisma';
import { Certification as PrismaCertification } from '@prisma/client';
import AbstractService, {
  parseDateForImport,
} from '../common/service/AbstractService';
import { StandardFilterDto } from 'src/common/dto/paginationAndSorting.dto';

@Injectable()
export class CertificationsService extends AbstractService<
  PrismaCertification,
  Certification,
  CertificationsDtoCsv,
  CertificationsDto,
  CertificationsDtoConnected,
  StandardFilterDto
> {
  logger = new Logger(CertificationsService.name);

  constructor(protected prisma: PrismaService) {
    super(prisma, prisma.certification as any);
  }

  async connectDependenciesForCreateAndUpdate(
    body: CertificationsDto,
    isUpdate: boolean,
  ): Promise<CertificationsDtoConnected> {
    const {
      certificationTypeId,
      farmId,
      farmCode,
      certificationTypeCode,
      ...rest
    } = body;

    let cId = certificationTypeId;
    let fId = farmId;

    if (!certificationTypeId && !certificationTypeCode) {
      throw Error(
        'Either certificationTypeId or certificationTypeCode has to be provided',
      );
    }

    if (certificationTypeCode) {
      cId = (
        await this.prisma.certificationType.findUnique({
          where: {
            shortCode_organisation: {
              shortCode: certificationTypeCode,
              organisation: body.organisation,
            },
          },
        })
      )['id'];
    }

    if (farmCode) {
      fId = (
        await this.prisma.farm.findMany({
          where: {
            AND: [
              { organisation: body.organisation },
              {
                OR: [{ id: farmId }],
              },
              {
                facility: {
                  is: {
                    shortCode: farmCode,
                  },
                },
              },
            ],
          },
        })
      )[0]['id'];
    }

    return {
      ...rest,
      farm: {
        connect: { id: fId },
      },
      certificationType: {
        connect: { id: cId },
      },
    } as CertificationsDtoConnected;
  }

  async convertForImport(
    body: CertificationsDtoCsv,
  ): Promise<CertificationsDto> {
    const res: CertificationsDto = {
      ...body,
      startsAt: parseDateForImport(body?.startsAt),
      endsAt: parseDateForImport(body?.endsAt),
    };
    return res;
  }
}
