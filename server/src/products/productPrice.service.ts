import { Injectable, Logger } from '@nestjs/common';
import { Price } from './models/products.model';
import { PriceDto, PriceDtoConnected, PriceDtoCsv } from './dto/products.dto';
import { PrismaService } from 'nestjs-prisma';
import { Price as PrismaPrice } from '@prisma/client';
import AbstractService, {
  parseIntForInport,
} from '../common/service/AbstractService';
import { StandardFilterDto } from '../common/dto/paginationAndSorting.dto';

@Injectable()
export class ProductPriceService extends AbstractService<
  PrismaPrice,
  Price,
  PriceDtoCsv,
  PriceDto,
  PriceDtoConnected,
  StandardFilterDto
> {
  logger = new Logger(ProductPriceService.name);

  constructor(protected prisma: PrismaService) {
    super(prisma, prisma.price as any);
  }

  public standardInclude() {
    return { product: true };
  }

  async connectDependenciesForCreateAndUpdate(
    body: PriceDto,
    isUpdate: boolean,
  ): Promise<PriceDtoConnected> {
    const { productId, productCode, ...rest } = body;

    const storedDeps = await this.prisma.product.findMany({
      where: {
        AND: [
          { organisation: body.organisation },
          {
            OR: [{ id: productId }, { shortCode: productCode }],
          },
        ],
      },
    });

    if (storedDeps.length === 0) {
      throw new Error(
        `product not found for code ${productCode || productId}: ${
          body.organisation
        }`,
      );
    }

    return {
      ...rest,
      active: true,
      product: {
        connect: { id: storedDeps[0].id },
      },
    } as PriceDtoConnected;
  }

  async convertForImport(body: PriceDtoCsv): Promise<PriceDto> {
    delete body['name'];

    const newVar = {
      ...body,
      productId: undefined,
      amount: parseIntForInport(body.amount),
      perAmountAmount: parseIntForInport(body.perAmountAmount),
    };
    return newVar;
  }
}
