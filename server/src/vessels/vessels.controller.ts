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
import { VesselsService } from './vessels.service';
import {
  PaginationAndSortingOutputDto,
  StandardFilterDto,
} from '../common/dto/paginationAndSorting.dto';
import { VesselsDto } from './dto/vessels.dto';
import { Vessel } from './models/vessels.model';

@Controller()
export class VesselsController {
  constructor(private readonly vesselService: VesselsService) {}

  @Post(':org/vessels') // TODO: Mini thing, should we use plural or singular?
  createVessel(
    @Param('org') org: string,
    @Body() body: VesselsDto,
  ): Promise<Vessel> {
    body.organisation = org;
    return this.vesselService.create(body);
  }

  @Patch(':org/vessels/:id')
  updateVessel(
    @Param('org') org: string,
    @Param('id') id: string,
    @Body() body: VesselsDto,
  ): Promise<Vessel> {
    return this.vesselService.update(id, body);
  }

  @Delete(':org/vessels/:id')
  deleteVessel(
    @Param('org') org: string,
    @Param('id') id: string,
  ): Promise<{ sucess: boolean }> {
    return this.vesselService.delete(id);
  }

  @Get(':org/vessels/:id')
  getVessel(
    @Param('org') org: string,
    @Param('id') id: string,
  ): Promise<Vessel> {
    return this.vesselService.getOne({
      id,
      org: org,
    });
  }

  @Get(':org/vessels')
  getVessels(
    @Param('org') org: string,
    @Query() filters: StandardFilterDto,
  ): Promise<PaginationAndSortingOutputDto<Vessel>> {
    filters.organisation = org;
    return this.vesselService.getMany(filters);
  }
}
