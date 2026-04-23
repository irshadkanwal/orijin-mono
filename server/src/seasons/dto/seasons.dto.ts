import { IsNotEmpty } from 'class-validator';
import { AbstractDto, AbstractImportCsvDto } from '../../common/dto/types';

export class AbstractSeasonsDto {
  @IsNotEmpty()
  shortCode: string;

  @IsNotEmpty()
  name: string;
}
export class SeasonsDtoCsv
  extends AbstractSeasonsDto
  implements AbstractImportCsvDto
{
  @IsNotEmpty()
  organisation: string;

  startsAt: string;
  endsAt?: string;
  active: string;
}

export class SeasonsDto extends AbstractSeasonsDto implements AbstractDto {
  organisation: string;

  @IsNotEmpty()
  startsAt: Date;

  endsAt?: Date;

  @IsNotEmpty()
  active: boolean;
}
