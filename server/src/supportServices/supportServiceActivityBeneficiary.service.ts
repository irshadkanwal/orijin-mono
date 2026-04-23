import { Injectable, Logger } from '@nestjs/common';
import { SupportServiceActivity } from './models/supportService.model';
import { PrismaService } from 'nestjs-prisma';
import { CsvImportService } from '../common/dto/types';
import { CreateSupportServiceActivityBeneficiaryDtoCsv } from './dto/createSupportServiceActivityBeneficiary.dto';
import {
  parseBooleanForImport,
  parseFloatForInport,
} from '../common/service/AbstractService';
import { Prisma } from '.prisma/client';

@Injectable()
export class SupportServiceActivityBeneficiaryService
  implements
    CsvImportService<
      CreateSupportServiceActivityBeneficiaryDtoCsv,
      SupportServiceActivity
    >
{
  logger = new Logger(SupportServiceActivityBeneficiaryService.name);

  constructor(protected prisma: PrismaService) {}

  async upsertImport(
    input: CreateSupportServiceActivityBeneficiaryDtoCsv,
  ): Promise<SupportServiceActivity> {
    const parent = await this.prisma.supportingServiceActivity.findUnique({
      where: {
        shortCode_organisation: {
          shortCode: input.serviceActivityCode,
          organisation: input.organisation,
        },
      },
      include: {
        ServiceActivityBeneficiaries: true,
      },
    });

    if (!parent) {
      throw Error('activity not found ' + input.serviceActivityCode);
    }

    const person = await this.prisma.person.findUnique({
      where: {
        shortCode_organisation: {
          organisation: input.organisation,
          shortCode: input.beneficiaryCode,
        },
      },
    });
    if (!person) {
      throw Error('person not found with ' + input.beneficiaryCode);
    }

    const myItem = parent.ServiceActivityBeneficiaries.find(
      (a) => a.personId === person.id,
    );

    const values:
      | Prisma.ServiceActivityBeneficiariesUpdateWithoutSupportingServiceActivityInput
      | Prisma.ServiceActivityBeneficiariesCreateInput = {
      itemValue: parseFloatForInport(input.itemValue),
      itemsProcessed: parseFloatForInport(input.itemsProcessed),
      primary: parseBooleanForImport(input.primary),
    };
    if (myItem) {
      await this.prisma.supportingServiceActivity.update({
        where: { id: parent.id },
        data: {
          ServiceActivityBeneficiaries: {
            update: {
              where: {
                id: myItem.id,
              },
              data: {
                ...values,
              },
            },
          },
        },
      });
    } else {
      await this.prisma.serviceActivityBeneficiaries.create({
        data: {
          supportingServiceActivity: {
            connect: {
              id: parent.id,
            },
          },
          person: {
            connect: {
              id: person.id,
            },
          },
          ...(values as Prisma.ServiceActivityBeneficiariesCreateInput),
        },
      });
    }

    return parent;
  }
}
