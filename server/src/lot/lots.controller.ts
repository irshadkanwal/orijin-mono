import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Lot } from './models/lot.model';
import { LotsService } from './lots.service';
import { LotsFilter } from './dto/lots.filter.dto';
import {
  PaginationAndSortingOutputDto,
  StandardFilterDto,
} from '../common/dto/paginationAndSorting.dto';

@Controller()
export class LotsController {
  constructor(private readonly lotService: LotsService) {}

  @Get(':org/lots')
  getLots(
    @Param('org') org: string,
    @Query() filters: StandardFilterDto,
  ): Promise<PaginationAndSortingOutputDto<Lot>> {
    filters.organisation = org;
    return this.lotService.getMany(filters);
  }

  @Get(':org/lots/:id')
  getLot(@Param('org') org: string, @Param('id') id: string): Promise<Lot> {
    return this.lotService.getOne(
      {
        id,
        org: org,
      }
    );
  }
}
