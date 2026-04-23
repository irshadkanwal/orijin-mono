import { Injectable, Logger } from '@nestjs/common';
import { CropvarietyService } from '../../crops/cropvariety.service';
import { AbstractExporter } from './AbstractExporter';
import VarietyV1 from '../v1entities/refdata/VarietyV1';
import { CropVariety } from '@prisma/client';
import { Meta } from '../v1entities/utis/types';
import { setupIdFields } from './../v1utils/utils';
import OrmProvider from '../v1services/OrmProvider';
import { ObjectId } from '../v1entities/utis/ObjectId';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class FirestoreVarietiesExporterService extends AbstractExporter<
  CropVariety,
  VarietyV1,
  CropvarietyService
> {
  private logger = new Logger(FirestoreVarietiesExporterService.name);

  constructor(
    protected firestoreService: OrmProvider,
    protected myService: CropvarietyService,
    protected prisma: PrismaService,
  ) {
    super(firestoreService, myService);
  }

  async transform(input: CropVariety, meta: Meta): Promise<VarietyV1> {
    const crop = await this.prisma.crop.findUnique({
      where: {
        id: input.cropId,
      },
    });

    const res = new VarietyV1();
    setupIdFields(res, input, meta);
    res.name = input.name;
    res.id.label = input.name;

    res.crop = new ObjectId(input.cropId, 'crops');
    res.crop.label = crop.name;
    res.crop.labelShort = crop.shortCode;

    return res;
  }
}
