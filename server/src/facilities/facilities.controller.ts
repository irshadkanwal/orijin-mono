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
import { Facility } from './models/facility.model';
import { FacilitiesService } from './facilities.service';
import {
  PaginationAndSortingOutputDto
} from '../common/dto/paginationAndSorting.dto';
import { FacilitiesDto, FacilityFilterDto } from './dto/facilities.dto';

@Controller()
export class FacilitiesController {
  constructor(private readonly facilityService: FacilitiesService) {}

  @Post(':org/facilities') // TODO: Mini thing, should we use plural or singular?
  createFacility(
    @Param('org') org: string,
    @Body() body: FacilitiesDto,
  ): Promise<Facility> {
    body.organisation = org;
    return this.facilityService.create(body);
  }

  @Patch(':org/facilities/:id')
  updateFacility(
    @Param('org') org: string,
    @Param('id') id: string,
    @Body() body: FacilitiesDto,
  ): Promise<Facility> {
    return this.facilityService.update(id, body);
  }

  @Delete(':org/facilities/:id')
  deleteFacility(
    @Param('org') org: string,
    @Param('id') id: string,
  ): Promise<{ sucess: boolean }> {
    return this.facilityService.delete(id);
  }

  @Get(':org/facilities/:id')
  getFacility(
    @Param('org') org: string,
    @Param('id') id: string,
  ): Promise<Facility> {
    return this.facilityService.getOne({
      id,
      org: org,
    });
  }

  @Get(':org/facilities')
  getFacilitys(
    @Param('org') org: string,
    @Query() params: FacilityFilterDto,
  ): Promise<PaginationAndSortingOutputDto<Facility>> {
    params.organisation = org;
    return this.facilityService.getMany({
      organisation: org,
      notFarm: params.notFarm
    });
  }
}
