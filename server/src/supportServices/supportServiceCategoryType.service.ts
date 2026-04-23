import { Injectable, Logger } from '@nestjs/common';
import { SupportServiceCategoryType } from './models/supportService.model';
import { PrismaService } from 'nestjs-prisma';
import {
  CreateServiceCategoryTypeValues,
  CreateServiceCategoryTypeValuesCSV,
} from './dto/createSupportServiceCategoryType.dto';
import { SupportingServiceCategoryType as PrimasSupportingServiceCategoryType } from '.prisma/client';
import AbstractService from '../common/service/AbstractService';
import { SupportServiceCategoryTypesFilterDto } from './dto/supportServiceCategoryTypes.filter.dto';

@Injectable()
export class SupportServiceCategoryTypeService extends AbstractService<
  PrimasSupportingServiceCategoryType,
  SupportServiceCategoryType,
  CreateServiceCategoryTypeValuesCSV,
  CreateServiceCategoryTypeValues,
  CreateServiceCategoryTypeValues,
  SupportServiceCategoryTypesFilterDto
  // Prisma.SupportingServiceCategoryTypeFindManyArgs
> {
  logger = new Logger(SupportServiceCategoryTypeService.name);

  constructor(protected prisma: PrismaService) {
    super(prisma, prisma.supportingServiceCategoryType as any);
  }
}
