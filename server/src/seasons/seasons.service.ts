import { Injectable, Logger } from '@nestjs/common';
import { Season } from './models/seasons.model';
import { SeasonsDto, SeasonsDtoCsv } from './dto/seasons.dto';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, Season as PrismaSeason } from '@prisma/client';
import AbstractService, {
  parseBooleanForImport,
  parseDateForImport,
} from '../common/service/AbstractService';
import { StandardFilterDto } from '../common/dto/paginationAndSorting.dto';

@Injectable()
export class SeasonsService extends AbstractService<
  PrismaSeason,
  Season,
  SeasonsDtoCsv,
  SeasonsDto,
  SeasonsDto,
  StandardFilterDto
> {
  logger = new Logger(SeasonsService.name);

  constructor(protected prisma: PrismaService) {
    super(prisma, prisma.season as any);
  }



  async convertForImport(body: SeasonsDtoCsv): Promise<SeasonsDto> {
    const res: SeasonsDto = {
      ...body,
      startsAt: parseDateForImport(body.startsAt),
      endsAt: parseDateForImport(body.endsAt),
      active: parseBooleanForImport(body.active),
    };
    return res;
  }
}
