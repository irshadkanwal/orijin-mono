import { Change as PrismaChange } from '.prisma/client';
import { IsNotEmpty } from 'class-validator';
import {
  AbstractImportCsvDto,
  EntityServiceOperationType,
} from '../../common/dto/types';
import { ChangeSourceType } from '../models/changes.model';

// Every key of PrismaChange except id
type AbstractDtoKeys = Partial<Record<keyof PrismaChange, unknown>>;

abstract class AbstractDto implements AbstractDtoKeys {
  @IsNotEmpty()
  objectId: string;
  startTime: Date;
  endTime: Date;
  transaction: string;
  sourceType: ChangeSourceType;
  operationType: EntityServiceOperationType;
  objectType: string;
  name: string;
  updatedBy: string;
  oldValue: string | null;
  newValue: string | null;
}

/** FIXME: Not really something we need for changes table  */
export class ChangesDtoCsv extends AbstractDto implements AbstractImportCsvDto {
  organisation: string;
  shortCode: string;
}

export class ChangesDto extends AbstractDto {
  id?: string;
  organisation: string;
}

//TODO: we can get rid of all these and use prisma param types
export class ChangesDtoConnected extends ChangesDto {}
