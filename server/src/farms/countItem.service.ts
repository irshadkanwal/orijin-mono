import { Injectable, Logger } from '@nestjs/common';
import {
  CountType,
  CountItem,
  CountCategory,
  CountSubType,
} from './models/farms.model';
import { PrismaService } from 'nestjs-prisma';
import { CountItem as PrismaCountItem, Prisma } from '@prisma/client';
import { CountItemDto } from './dto/farms.dto';

function convert(prismaCountItemClient: PrismaCountItem): CountItem {
  return {
    ...prismaCountItemClient,
    type: prismaCountItemClient.type as CountType,
    category: prismaCountItemClient.category as CountCategory,
    subType: prismaCountItemClient.subType as CountSubType,
  };
}

@Injectable()
export class CountItemService {
  logger = new Logger(CountItemService.name);

  constructor(private prisma: PrismaService) {}

  async getOne(id: string): Promise<CountItem> {
    const prismaCountItemClient = await this.prisma.countItem.findUnique({
      where: { id: id },
    });

    return convert(prismaCountItemClient);
  }

  async getAll(): Promise<CountItem[]> {
    const prismaPromise = await this.prisma.countItem.findMany();
    return prismaPromise.map((a) => convert(a));
  }

  // async create(body: CountItemDto): Promise<CountItem> {
  //   const { ...restOfValues } = body;
  //   return convert(
  //     await this.prisma.countItem.create({
  //       data: {
  //         ...restOfValues,
  //       },
  //     }),
  //   );
  // }
}
