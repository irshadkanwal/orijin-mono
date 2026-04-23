import { Injectable, Logger } from '@nestjs/common';
import { Organisation } from './models/organisations.model';
import { OrganisationsDto } from './dto/organisations.dto';
import { PrismaService } from 'nestjs-prisma';
import { Organisation as PrismaOrganisation, Prisma } from '@prisma/client';

function convert(prismaOrganisationClient: PrismaOrganisation): Organisation {
  return {
    ...prismaOrganisationClient,
  };
}

@Injectable()
export class OrganisationsService {
  logger = new Logger(OrganisationsService.name);

  constructor(private prisma: PrismaService) {}

  async getOne(id: string): Promise<Organisation> {
    const prismaOrganisationClient = await this.prisma.organisation.findUnique({
      where: { id: id },
    });

    return convert(prismaOrganisationClient);
  }

  async getAll(): Promise<Organisation[]> {
    const prismaPromise = await this.prisma.organisation.findMany();
    return prismaPromise.map((a) => convert(a));
  }

  async create(body: OrganisationsDto): Promise<Organisation> {
    const { ...restOfValues } = body.values;
    return convert(
      await this.prisma.organisation.create({
        data: {
          ...restOfValues,
        },
      }),
    );
  }
}
