import { Injectable, Logger } from '@nestjs/common';
import { Contract } from './models/contracts.model';
import { ContractsDto } from './dto/contracts.dto';
import { PrismaService } from 'nestjs-prisma';
import { Contract as PrismaContract } from '.prisma/client';

function convert(prismaClient: PrismaContract): Contract {
  const result: Contract = {
    ...prismaClient,
    // data: prismaClient.data as ContractCoordinate[],
    // type: prismaClient.type as ContractType,
    // areaManual: prismaClient.areaManual?.toNumber(),
    // areaCalculated: prismaClient.areaCalculated?.toNumber(),
  };
  return result;
}

@Injectable()
export class ContractsService {
  logger = new Logger(ContractsService.name);

  constructor(private prisma: PrismaService) {}

  async getOne(id: string): Promise<Contract> {
    const prismaContractClient: PrismaContract =
      await this.prisma.contract.findUnique({
        where: { id: id },
      });
    return convert(prismaContractClient);
  }

  async getAll(): Promise<Contract[]> {
    const contracts = await this.prisma.contract.findMany();
    return contracts.map((contract) => convert(contract));
  }

  async create(body: ContractsDto): Promise<Contract> {
    const { ...restOfValues } = body.values;

    // Person did not exist in the schema
    // if (!personId && !personCode) {
    //   throw Error('Either personId or personCode has to be provided');
    // }
    // let pId = personId;

    // if (personCode) {
    //   pId = (
    //     await this.prisma.person.findUnique({
    //       where: { shortCode: personCode },
    //     })
    //   ).id;
    // }

    return convert(
      await this.prisma.contract.create({
        data: {
          ...restOfValues,
          organisation: body.meta.organisation,

          // Person link doesn't exist in the Shema
          // person: {
          //   connect: { id: pId },
          // },
          // personId: pId,
        },
      }),
    );
  }
}
