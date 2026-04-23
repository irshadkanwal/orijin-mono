import { Injectable, Logger } from '@nestjs/common';
import { AbstractExporter } from './AbstractExporter';
import { Meta } from '../v1entities/utis/types';
import { setupIdFields } from '../v1utils/utils';
import OrmProvider from '../v1services/OrmProvider';
import { ContactV1 } from '../v1entities/farms/ContactV1';
import { ContactsService } from '../../persons/contacts.service';
import { Contact } from '../../persons/models/persons.model';
import { ObjectId } from '../v1entities/utis/ObjectId';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class FirestoreContactExporterService extends AbstractExporter<
  Contact,
  ContactV1,
  ContactsService
> {
  private logger = new Logger(FirestoreContactExporterService.name);

  constructor(
    protected firestoreService: OrmProvider,
    protected myService: ContactsService,
    protected prisma: PrismaService,
  ) {
    super(firestoreService, myService);
  }

  async transform(input: Contact, meta: Meta): Promise<ContactV1> {
    const res = new ContactV1();
    setupIdFields(res, input, meta);
    res.id.label = `${input.phone}`;
    res.firstName = input.firstName;
    res.lastName = input.lastName;
    res.phone = input.phone;
    res.registeredUnderPrincipalsName = input.registeredUnderPrincipalsName;
    res.registeredForMobileMoney = input.registeredForMobileMoney;

    const person = await this.prisma.person.findUnique({
      where: {
        id: input.personId,
      },
    });

    const personId = new ObjectId(input.personId, 'users');
    personId.labelShort = person.shortCode;
    personId.label = `${person.firstName} ${person.lastName}`;
    res.entity = personId;

    const wallets = await this.prisma.wallet.findMany({
      where: {
        contactId: input.id,
      },
    });

    if (wallets.length > 0) {
      const wallet = wallets[0];
      const walletId = new ObjectId(wallet.id, 'wallets');
      walletId.labelShort = wallet.phone;
      walletId.label = wallet.phone;
      res.wallet = walletId;
    }

    return res;
  }

  async exportAll(meta: Meta, key?: string): Promise<ContactV1[]> {
    meta.onlyCreate = true;
    return super.exportAll(meta, key);
  }
}
