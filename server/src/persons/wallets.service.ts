import { Injectable, Logger } from '@nestjs/common';
import { Wallet } from './models/persons.model';
import {
  WalletsDto,
  WalletsDtoConnected,
  WalletsDtoCsv,
} from './dto/wallets.dto';
import { PrismaService } from 'nestjs-prisma';
import { Contact, Person, Wallet as PrismaWallet } from '@prisma/client';
import AbstractService from '../common/service/AbstractService';
import { StandardFilterDto } from '../common/dto/paginationAndSorting.dto';

@Injectable()
export class WalletsService extends AbstractService<
  PrismaWallet,
  Wallet,
  WalletsDtoCsv,
  WalletsDto,
  WalletsDto,
  StandardFilterDto
> {
  logger = new Logger(WalletsService.name);

  constructor(protected prisma: PrismaService) {
    super(prisma, prisma.wallet as any);
  }

  async convertForImport(body: WalletsDtoCsv): Promise<WalletsDto> {
    const res: WalletsDto = {
      ...body,
    };
    return res;
  }

  async connectDependenciesForCreateAndUpdate(
    body: WalletsDto,
    isUpdate: boolean,
  ): Promise<WalletsDtoConnected> {
    const { contactId, contactCode, ...rest } = body;

    const storedContact: Contact[] = await this.prisma.contact.findMany({
      where: {
        AND: [
          { organisation: body.organisation },
          {
            OR: [{ id: contactId }, { shortCode: contactCode }],
          },
        ],
      },
    });

    if (storedContact.length === 0) {
      throw new Error(
        'contact not found for code ' + (contactCode || contactId),
      );
    }

    return {
      ...rest,
      contact: {
        connect: { id: storedContact[0].id },
      },
    } as WalletsDtoConnected;
  }
}
