import { Injectable, Logger } from '@nestjs/common';
import { PersonsService } from '../../persons/persons.service';
import { Person } from '../../persons/models/persons.model';
import { AbstractExporter } from './AbstractExporter';
import UserV1 from '../v1entities/org/UserV1';
import { transformUserV2 } from './../v1utils/utils';
import { Meta } from '../v1entities/utis/types';
import OrmProvider from '../v1services/OrmProvider';
import { FarmsService } from '../../farms/farms.service';
import { PrismaService } from 'nestjs-prisma';
import { Farm } from '../../farms/models/farms.model';

@Injectable()
export class FirestorePersonExporterService extends AbstractExporter<
  Person,
  UserV1,
  PersonsService
> {
  private logger = new Logger(FirestorePersonExporterService.name);

  constructor(
    protected firestoreService: OrmProvider,
    protected myService: PersonsService,
    protected farmService: FarmsService,
    protected prisma: PrismaService,
  ) {
    super(firestoreService, myService);
  }

  async transform(person: Person, meta: Meta): Promise<UserV1> {
    let farm = null;
    if (person.mainContactPersonFor[0]) {
      const facility = await this.prisma.facility.findUnique({
        where: {
          id: person.mainContactPersonFor[0].id,
        },
      });

      farm = await this.prisma.farm.findUnique({
        where: { facilityId: facility.id },
        include: {
          facility: true,
        },
      });
    }

    const res = transformUserV2(person, farm as any as Farm, meta);

    return res;
  }
  async exportAll(meta: Meta, key?: string): Promise<UserV1[]> {
    meta.onlyCreate = true;
    return super.exportAll(meta, key);
  }
}
