import { Injectable, Logger } from '@nestjs/common';
import { Tag } from './models/tags.model';
import { TagsDto } from './dto/tags.dto';
import { PrismaService } from 'nestjs-prisma';
import { Tag as PrismaTag, Prisma } from '@prisma/client';

function convert(prismaTagClient: PrismaTag): Tag {
  return {
    ...prismaTagClient,
  };
}

@Injectable()
export class TagsService {
  logger = new Logger(TagsService.name);

  constructor(private prisma: PrismaService) {}

  async getOne(id: string): Promise<Tag> {
    const prismaTagClient = await this.prisma.tag.findUnique({
      where: { id: id },
    });

    return convert(prismaTagClient);
  }

  async getAll(): Promise<Tag[]> {
    const prismaPromise = await this.prisma.tag.findMany();
    return prismaPromise.map((a) => convert(a));
  }

  async create(body: TagsDto): Promise<Tag> {
    const { ...restOfValues } = body.values;
    return convert(
      await this.prisma.tag.create({
        data: {
          ...restOfValues,
        },
      }),
    );
  }
}
