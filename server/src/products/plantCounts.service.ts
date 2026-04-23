import { Injectable, Logger } from '@nestjs/common';
import { ProductType } from './models/products.model';
import { ProductTypeDto } from './dto/products.dto';
import { PrismaService } from 'nestjs-prisma';
import { ProductType as PrismaProductType, Prisma } from '@prisma/client';

function convert(prismaProductTypeClient: PrismaProductType): ProductType {
  return {
    ...prismaProductTypeClient,
  };
}

@Injectable()
export class ProductTypesService {
  logger = new Logger(ProductTypesService.name);

  constructor(private prisma: PrismaService) {}

  async getOne(id: string): Promise<ProductType> {
    const prismaProductTypeClient = await this.prisma.productType.findUnique({
      where: { id: id },
    });

    return convert(prismaProductTypeClient);
  }

  async getAll(): Promise<ProductType[]> {
    const prismaPromise = await this.prisma.productType.findMany();
    return prismaPromise.map((a) => convert(a));
  }

  async create(body: ProductTypeDto): Promise<ProductType> {
    const { ...restOfValues } = body;
    return convert(
      await this.prisma.productType.create({
        data: {
          ...restOfValues,
        },
      }),
    );
  }
}
