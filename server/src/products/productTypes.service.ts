import { Injectable, Logger } from '@nestjs/common';
import { ProductType } from './models/products.model';
import {
  ProductTypeDto,
  ProductTypeDtoConnected,
  ProductTypeDtoCsv,
} from './dto/products.dto';
import { PrismaService } from 'nestjs-prisma';
import { Crop, ProductType as PrismaProductType } from '@prisma/client';
import AbstractService from '../common/service/AbstractService';
import { StandardFilterDto } from '../common/dto/paginationAndSorting.dto';

@Injectable()
export class ProductTypesService extends AbstractService<
  PrismaProductType,
  ProductType,
  ProductTypeDtoCsv,
  ProductTypeDto,
  ProductTypeDtoConnected,
  StandardFilterDto
> {
  logger = new Logger(ProductTypesService.name);

  constructor(protected prisma: PrismaService) {
    super(prisma, prisma.productType as any);
  }

  async connectDependenciesForCreateAndUpdate(
    body: ProductTypeDto,
    isUpdate: boolean,
  ): Promise<ProductTypeDtoConnected> {
    const { cropId, cropCode, ...rest } = body;
    const storedCrops: Crop[] = await this.prisma.crop.findMany({
      where: {
        AND: [
          { organisation: body.organisation },
          {
            OR: [{ id: cropId }, { shortCode: cropCode }],
          },
        ],
      },
    });

    if (storedCrops.length === 0) {
      throw new Error('Crop not found for code ' + (cropCode || cropId));
    }

    return {
      ...rest,
      crop: {
        connect: { id: storedCrops[0].id },
      },
    } as ProductTypeDtoConnected;
  }

  standardInclude() {
    return {
      crop: true,
    };
  }
}
