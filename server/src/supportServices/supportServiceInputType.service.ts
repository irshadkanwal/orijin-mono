import { Injectable, Logger } from '@nestjs/common';
import { SupportServiceInputType } from './models/supportService.model';
import { PrismaService } from 'nestjs-prisma';
import { SupportingServiceInputType as PrismaSupportingServiceActivityInputType } from '.prisma/client';
import AbstractService from '../common/service/AbstractService';
import {
  CreateSupportServiceActivityTypeDtoConnected,
  SupportServiceActivityTypeDto,
  SupportServiceActivityTypeDtoCsv,
} from './dto/supportServiceActivityType.dto';
import {
  CreateSupportServiceInputTypeDtoConnected,
  SupportServiceInputTypeDto,
  SupportServiceInputTypeDtoCsv,
  SupportServiceInputTypesFilterDto,
} from './dto/supportServiceInputType.dto';

@Injectable()
export class SupportServiceInputTypeService extends AbstractService<
  PrismaSupportingServiceActivityInputType,
  SupportServiceInputType,
  SupportServiceInputTypeDtoCsv,
  SupportServiceInputTypeDto,
  CreateSupportServiceInputTypeDtoConnected,
  SupportServiceInputTypesFilterDto
> {
  logger = new Logger(SupportServiceInputTypeService.name);

  constructor(protected prisma: PrismaService) {
    super(prisma, prisma.supportingServiceInputType as any);
  }

  public standardInclude() {
    return {
      supportingServiceCategory: true,
    };
  }

  async connectDependenciesForCreateAndUpdate(
    body: SupportServiceActivityTypeDto | SupportServiceActivityTypeDtoCsv,
    isUpdate: boolean,
  ): Promise<CreateSupportServiceActivityTypeDtoConnected> {
    const { supportingServiceCategoryCode, ...rest } = body;

    const csvInput = body as SupportServiceActivityTypeDtoCsv;
    const dtoInput = body as SupportServiceActivityTypeDto;

    let supportingServiceCategoryId = dtoInput.supportingServiceCategoryId;

    delete rest['supportingServiceCategoryId'];
    delete rest['supportingServiceInputTypeCode'];

    const cats = await this.prisma.supportingServiceCategory.findMany({
      where: {
        AND: [
          { organisation: body.organisation },
          {
            OR: [
              { id: supportingServiceCategoryId },
              { shortCode: supportingServiceCategoryCode },
            ],
          },
        ],
      },
    });

    if (cats.length !== 1) {
      throw new Error(
        'supportingServiceCategory not found for code ' +
          (supportingServiceCategoryId || supportingServiceCategoryCode),
      );
    }
    supportingServiceCategoryId = cats[0].id;

    const updateData: any = {
      ...rest,
      supportingServiceCategory: {
        connect: { id: supportingServiceCategoryId },
      },
    };

    return updateData as CreateSupportServiceActivityTypeDtoConnected;
  }
}
