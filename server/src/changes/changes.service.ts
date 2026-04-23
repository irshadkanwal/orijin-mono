import { Injectable, Logger } from '@nestjs/common';
import { Change, ChangeSourceType } from './models/changes.model';
import {
  ChangesDto,
  ChangesDtoConnected,
  ChangesDtoCsv,
} from './dto/changes.dto';
import { PrismaService } from 'nestjs-prisma';
import { ChangesFilter } from './dto/changes.filter.dto';
import { addPagination } from '../common/prisma.helper';
import { Change as PrismaChange, Prisma } from '@prisma/client';
import { PaginationAndSortingOutputDto } from '../common/dto/paginationAndSorting.dto';
import AbstractService from '../common/service/AbstractService';
import { randomUUID } from 'crypto';
import { EntityServiceOperationType } from 'src/common/dto/types';

const serialize = (value: any): string | null => {
  if (value === null || value === undefined) {
    return null;
  }

  if (value instanceof Prisma.Decimal) {
    return value.toString();
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
};

@Injectable()
export class ChangesService extends AbstractService<
  PrismaChange,
  Change,
  ChangesDtoCsv,
  ChangesDto,
  ChangesDtoConnected,
  ChangesFilter
> {
  logger = new Logger(ChangesService.name);

  constructor(protected prisma: PrismaService) {
    super(prisma, prisma.change as any);
  }

  private convertFiltersToWhere = (
    filters: ChangesFilter,
  ): Prisma.ChangeWhereInput => {
    return filters;
  };

  async getMany(
    filters?: ChangesFilter,
  ): Promise<PaginationAndSortingOutputDto<Change>> {
    const args: Prisma.ChangeFindManyArgs = {
      where: this.convertFiltersToWhere(filters),
      orderBy: { startTime: 'desc' },
      ...addPagination(filters),
    };
    const [data, count] = await this.prisma.$transaction([
      this.prisma.change.findMany(args),
      this.prisma.change.count({ where: args.where }),
    ]);
    return {
      data: data as Change[],
      count,
    };
  }

  async populate(
    objectId: string,
    objectType: string,
    sourceType: ChangeSourceType,
    updatedBy: string,
    operationType: EntityServiceOperationType | undefined,
    diff: any, // FIXME: type is getObjectDifferences output
  ): Promise<void> {
    const transaction = randomUUID();
    const startTime = new Date();
    const latest = await this.prisma.change.findMany({
      where: {
        objectType,
        objectId,
        endTime: new Date('2100-01-01T00:00:00.000Z'),
      },
      orderBy: { startTime: 'desc' },
    });

    if (latest.length > 0) {
      // Mark the previous changes as ended
      await this.prisma.change.updateMany({
        where: {
          id: { in: latest.map((c) => c.id) },
          name: { in: Object.keys(diff) },
        },
        data: {
          endTime: startTime,
        },
      });
    }

    const fields = this.prisma[objectType].fields;
    if (!fields) {
      throw new Error(`Prisma fields not found for ${objectType}`);
    }
    const fieldNames = Object.keys(fields);

    // Add the new changes
    const data = Object.entries(diff)
      .map(
        ([name, o]: [string, { oldValue: unknown; newValue: unknown }]) =>
          ({
            id: randomUUID(),
            transaction,
            objectId,
            objectType,
            sourceType,
            operationType,
            updatedBy,
            name,
            oldValue: serialize(o.oldValue) || null,
            newValue: serialize(o.newValue) || null,
            startTime: startTime,
            endTime: new Date('2100-01-01T00:00:00.000Z'),
          } satisfies PrismaChange),
      )
      .filter((d) => fieldNames.includes(d.name))
      .filter((d) => d.oldValue !== d.newValue);

    const extraFieldsChanges = data.filter((d) => !fieldNames.includes(d.name));
    if (extraFieldsChanges.length > 0) {
      this.logger.warn(
        `Unknown fields for ${objectType}: ${extraFieldsChanges
          .map((c) => c.name)
          .join(', ')}`,
      );
    }

    await this.prisma.change.createMany({
      data,
    });
  }
}
