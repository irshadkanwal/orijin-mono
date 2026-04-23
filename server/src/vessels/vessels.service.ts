import { Injectable, Logger } from '@nestjs/common';
import {
  VesselsDto,
  VesselsDtoConnected,
  VesselsDtoCsv,
} from './dto/vessels.dto';
import { PrismaService } from 'nestjs-prisma';
import { Vessel as PrismaVessel } from '.prisma/client';
import { Vessel } from './models/vessels.model';
import AbstractService, {
  parseBooleanForImport,
  parseIntForInport,
} from '../common/service/AbstractService';
import { StandardFilterDto } from '../common/dto/paginationAndSorting.dto';
@Injectable()
export class VesselsService extends AbstractService<
  PrismaVessel,
  Vessel,
  VesselsDtoCsv,
  VesselsDto,
  VesselsDtoConnected,
  StandardFilterDto
> {
  logger = new Logger(VesselsService.name);
  constructor(protected prisma: PrismaService) {
    super(prisma, prisma.vessel as any);
  }
  public standardInclude() {
    return {
      facility: true,
      plot: true,
    };
  }
  async connectDependenciesForCreateAndUpdate(
    body: VesselsDto,
    isUpdate: boolean,
  ): Promise<VesselsDtoConnected> {
    const { plotId, plotCode, facilityId, facilityCode, ...rest } = body;

    let pId = plotId;
    let fId = facilityId;

    if (plotCode) {
      pId = (
        await this.prisma.plot.findFirst({
          where: {
            shortCode: { equals: plotCode, mode: 'insensitive' },
            farm: {
              is: {
                organisation: body.organisation,
              },
            },
          },
        })
      )['id'];
    }

    if (facilityCode) {
      fId = (
        await this.prisma.facility.findMany({
          where: {
            AND: [
              { organisation: body.organisation },
              {
                OR: [{ id: facilityId }],
              },
              {
                shortCode: {
                  equals: facilityCode,
                  mode: 'insensitive',
                },
              },
            ],
          },
        })
      )[0]['id'];
    }

    return {
      ...rest,
      plot: pId
        ? {
            connect: { id: pId },
          }
        : undefined,
      facility: fId
        ? {
            connect: { id: fId },
          }
        : undefined,
    } as VesselsDtoConnected;
  }

  async convertForImport(body: VesselsDtoCsv): Promise<VesselsDto> {
    const res: VesselsDto = {
      ...body,
      permanent: parseBooleanForImport(body?.permanent),
      size: parseIntForInport(body?.size),
      weight: parseIntForInport(body?.weight),
    };
    return res;
  }
}
