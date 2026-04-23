import { Injectable, Logger } from '@nestjs/common';
import { Polygon } from './models/geodatas.model';
import {
  PolygonDto,
  PolygonDtoConnected,
  PolygonDtoCsv,
} from './dto/geodatasDto';
import { PrismaService } from 'nestjs-prisma';
import { Polygon as PrismaGeoData } from '@prisma/client';
import AbstractService, {
  parseBooleanForImport,
  parseFloatForInport,
} from '../common/service/AbstractService';
import { StandardFilterDto } from '../common/dto/paginationAndSorting.dto';

@Injectable()
export class PolygonService extends AbstractService<
  PrismaGeoData,
  Polygon,
  PolygonDtoCsv,
  PolygonDto,
  PolygonDtoConnected,
  StandardFilterDto
> {
  logger = new Logger(PolygonService.name);

  constructor(protected prisma: PrismaService) {
    super(prisma, prisma.polygon as any);
  }

  public standardInclude() {
    return {
      plot: true,
      polygonInteractionWarnings: {
        include: { polygons: true },
      },
    };
  }

  async getAllActivePolygonsForOrgAndSeason(org, seasonId): Promise<any[]> {
    return this.prisma.polygon.findMany({
      where: {
        active: true,
        plot: { farm: { organisation: org, seasonId: seasonId } },
      },
      include: this.standardInclude(),
      orderBy: {
        plot: { shortCode: 'asc' },
      },
    });
  }

  //TODO:
  // implement better way to update warnings
  async updatePolygon(id: string, polygonData: Partial<Polygon>) {
    const {
      plotId,
      polygonWarnings,
      polygonInteractionWarnings,
      ...restOfData
    } = polygonData;
    return this.prisma.polygon.update({
      where: { id: id },
      data: restOfData,
    });
  }

  async connectDependenciesForCreateAndUpdate(
    body: PolygonDto,
    isUpdate: boolean,
  ): Promise<PolygonDtoConnected> {
    const { plotId, plotCode, ...rest } = body;

    if (!plotCode && !plotId) {
      throw Error('Either plotId or plotCode has to be provided');
    }
    let pId = plotId;
    if (plotCode) {
      pId = (
        await this.prisma.plot.findFirst({
          where: { shortCode: plotCode },
        })
      )?.id;
    }

    return {
      ...rest,
      plot: {
        connect: { id: pId },
      },
    } as PolygonDtoConnected;
  }

  async convertForImport(body: PolygonDtoCsv): Promise<PolygonDto> {
    delete body.organisation;
    const res: PolygonDto = {
      ...body,
      active: parseBooleanForImport(body.active),
      areaCalculated: parseFloatForInport(body.areaCalculated),
    };
    return res;
  }

  async findUnique(shortCode: string, organisation: string): Promise<Polygon> {
    const existing: Polygon = await this.prisma.polygon.findFirst({
      where: {
        shortCode: shortCode,
        plot: {
          farm: {
            organisation: organisation, // Match Farm's organisation
          },
        },
        id: undefined,
        deletedAt: null,
      },
      include: this.standardInclude(),
    });
    return existing;
  }
}
