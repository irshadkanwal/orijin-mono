import { Injectable, Logger } from '@nestjs/common';
import { Contact } from './models/persons.model';
import {
  ContactsDto,
  ContactsDtoConnected,
  ContactsDtoCsv,
} from './dto/contacts.dto';
import { PrismaService } from 'nestjs-prisma';
import { Contact as PrismaContact, Person } from '@prisma/client';
import AbstractService from '../common/service/AbstractService';
import { StandardFilterDto } from '../common/dto/paginationAndSorting.dto';

@Injectable()
export class ContactsService extends AbstractService<
  PrismaContact,
  Contact,
  ContactsDtoCsv,
  ContactsDto,
  ContactsDto,
  StandardFilterDto
> {
  logger = new Logger(ContactsService.name);

  constructor(protected prisma: PrismaService) {
    super(prisma, prisma.contact as any);
  }

  async connectDependenciesForCreateAndUpdate(
    body: ContactsDto,
    isUpdate: boolean,
  ): Promise<ContactsDtoConnected> {
    const { personId, personCode, ...rest } = body;
    const storedPerson: Person[] = await this.prisma.person.findMany({
      where: {
        AND: [
          { organisation: body.organisation },
          {
            OR: [{ id: personId }, { shortCode: personCode }],
          },
        ],
      },
    });

    if (storedPerson.length === 0) {
      throw new Error('person not found for code ' + (personCode || personId));
    }

    return {
      ...rest,
      person: {
        connect: { id: storedPerson[0].id },
      },
    } as ContactsDtoConnected;
  }
}
