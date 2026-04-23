import { Injectable, Logger } from '@nestjs/common';
import { CropsDto, CropsDtoCsv } from './dto/crops.dto';
import { PrismaService } from 'nestjs-prisma';
import { Crop as PrismaCrop } from '.prisma/client';
import { Crop } from './models/crops.model';
import AbstractService from '../common/service/AbstractService';
import { StandardFilterDto } from '../common/dto/paginationAndSorting.dto';

@Injectable()
export class CropsService extends AbstractService<
  PrismaCrop,
  Crop,
  CropsDtoCsv,
  CropsDto,
  CropsDto,
  StandardFilterDto
> {
  logger = new Logger(CropsService.name);

  constructor(protected prisma: PrismaService) {
    super(
      prisma,
      //TODO: SM fix the types
      prisma.crop as any,
    );
  }

  async findUnique(shortCode: string, organisation: string): Promise<Crop> {
    const existing: Crop = await this.prisma.crop.findUnique({
      where: {
        // shortCode: shortCode,
        // organisation: organisation,
        shortCode_organisation: {
          shortCode: shortCode,
          organisation: organisation
        },
        id: undefined,
        deletedAt: null,
      },
      include: this.standardInclude(),
    });
    return existing;
  }
}
