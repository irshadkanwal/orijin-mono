import { IsNotEmpty } from 'class-validator';
import { type EnumMainType } from '@prisma/client';

export class LocationsDto {
  organisation: string;

  @IsNotEmpty()
  shortCode: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  type: string;

  parent?: any;

  // TODO: Tarvitaanko??
  parentId?: string;
  parentCode?: string;

  mainType?: EnumMainType;
}
