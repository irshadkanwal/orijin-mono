import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Season } from './models/seasons.model';
import { SeasonsService } from './seasons.service';
import {
  PaginationAndSortingOutputDto,
  StandardFilterDto,
} from '../common/dto/paginationAndSorting.dto';
import { SeasonsDto } from './dto/seasons.dto';

@Controller()
export class SeasonsController {
  constructor(private readonly seasonService: SeasonsService) {}

  @Post(':org/seasons') // TODO: Mini thing, should we use plural or singular?
  createSeason(
    @Param('org') org: string,
    @Body() body: SeasonsDto,
  ): Promise<Season> {
    body.organisation = org;
    return this.seasonService.create(body);
  }

  @Patch(':org/seasons/:id')
  updateSeason(
    @Param('org') org: string,
    @Param('id') id: string,
    @Body() body: SeasonsDto,
  ): Promise<Season> {
    return this.seasonService.update(id, body);
  }

  @Delete(':org/seasons/:id')
  deleteSeason(
    @Param('org') org: string,
    @Param('id') id: string,
  ): Promise<{ sucess: boolean }> {
    return this.seasonService.delete(id);
  }

  @Get(':org/seasons/:id')
  getSeason(
    @Param('org') org: string,
    @Param('id') id: string,
  ): Promise<Season> {
    return this.seasonService.getOne({
      id,
      org: org,
    });
  }

  @Get(':org/seasons')
  getSeasons(
    @Param('org') org: string,
    @Query() params: StandardFilterDto,
  ): Promise<PaginationAndSortingOutputDto<Season>> {
    params.organisation = org;
    return this.seasonService.getMany({
      organisation: org,
      sort: params.sort ?? 'shortCode',
    });
  }
}
