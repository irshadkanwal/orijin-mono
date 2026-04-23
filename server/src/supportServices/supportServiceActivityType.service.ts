import { Injectable, Logger } from '@nestjs/common';
import { SupportServiceActivityType } from './models/supportService.model';
import { PrismaService } from 'nestjs-prisma';
import { SupportingServiceActivityType as PrismaSupportingServiceActivityType } from '.prisma/client';
import AbstractService from '../common/service/AbstractService';
import { SupportServiceActivityFilterDto } from './dto/supportServiceActivity.filter.dto';
import {
  CreateSupportServiceActivityTypeDtoConnected,
  SupportServiceActivityTypeDto,
  SupportServiceActivityTypeDtoCsv,
} from './dto/supportServiceActivityType.dto';
import { setupDependencyBasedOnShortCodeOrId } from '../common/prismaUtils';

@Injectable()
export class SupportServiceActivityTypeService extends AbstractService<
  PrismaSupportingServiceActivityType,
  SupportServiceActivityType,
  SupportServiceActivityTypeDtoCsv,
  SupportServiceActivityTypeDto,
  CreateSupportServiceActivityTypeDtoConnected,
  SupportServiceActivityFilterDto
> {
  logger = new Logger(SupportServiceActivityTypeService.name);

  constructor(protected prisma: PrismaService) {
    super(prisma, prisma.supportingServiceActivityType as any);
  }

  public standardInclude() {
    return {
      supportingServiceInputType: true,
      supportingServiceCategory: true,
    };
  }

  async connectDependenciesForCreateAndUpdate(
    body: SupportServiceActivityTypeDto | SupportServiceActivityTypeDtoCsv,
    isUpdate: boolean,
  ): Promise<CreateSupportServiceActivityTypeDtoConnected> {
    const {
      supportingServiceCategoryCode,
      supportingServiceInputTypeCode,
      ...rest
    } = body;

    const csvInput = body as SupportServiceActivityTypeDtoCsv;
    const dtoInput = body as SupportServiceActivityTypeDto;

    const supportingServiceCategoryId = dtoInput.supportingServiceCategoryId;
    const supportingServiceInputTypeId = dtoInput.supportingServiceInputTypeId;

    const updateData: any = {
      ...rest,
    };
    await setupDependencyBasedOnShortCodeOrId(
      'supportingServiceCategory',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.prisma.supportingServiceCategory,
      supportingServiceCategoryCode,
      supportingServiceCategoryId,
      body.organisation,
      true,
      isUpdate,
      updateData,
    );
    await setupDependencyBasedOnShortCodeOrId(
      'supportingServiceInputType',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.prisma.supportingServiceInputType,
      supportingServiceInputTypeCode,
      supportingServiceInputTypeId,
      body.organisation,
      false,
      isUpdate,
      updateData,
    );

    return updateData as CreateSupportServiceActivityTypeDtoConnected;
  }
}
