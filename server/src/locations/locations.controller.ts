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
import { Location, LocationLevels } from './models/locations.model';
import { LocationsService } from './locations.service';
import { LocationsFilter } from './dto/locations.filter.dto';
import { LocationsDto } from './dto/locations.dto';
import {
  PaginationAndSortingOutputDto,
  StandardFilterDto,
} from '../common/dto/paginationAndSorting.dto';
import { FarmsFilter } from '../farms/dto/farms.filter.dto';

@Controller()
export class LocationsController {
  constructor(private readonly locationService: LocationsService) {}

  @Post(':org/locations')
  postLocation(@Param('org') org: string, @Body() body): Promise<Location> {
    return this.locationService.create({ ...body, organisation: org });
  }

  @Patch(':org/locations/:id')
  updateLocation(
    @Param('org') org: string,
    @Param('id') id: string,
    @Body() body: LocationsDto,
  ): Promise<Location> {
    body.organisation = org;
    return this.locationService.update(id, body);
  }

  @Get(':org/locations')
  getLocations(
    @Param('org') org: string,
    @Query() filters: LocationsFilter,
  ): Promise<PaginationAndSortingOutputDto<Location>> {
    filters.organisation = org;
    return this.locationService.getMany(filters);
  }

  @Get(':org/locations-filter')
  getLocationsForFilters(
    @Param('org') org: string,
    @Query() filters: LocationsFilter,
  ): Promise<Location[]> {
    filters.organisation = org;
    console.log('called: ', org);
    return this.locationService.getAllForFilterOptions(filters);
  }

  @Delete(':org/locations/:id')
  deleteLocation(
    @Param('org') org: string,
    @Param('id') id: string,
  ): Promise<{ sucess: boolean }> {
    return this.locationService.delete(id);
  }

  @Get(':org/locations/:id')
  getLocation(
    @Param('org') org: string,
    @Param('id') id: string,
    @Query() params: LocationsFilter,
  ): Promise<Location> {
    return this.locationService.getOne({
      id,
      org: org,
    });
  }

  @Get(':org/locationsByType')
  getLocationsByType(
    @Param('org') org: string,
    @Query() filters?: FarmsFilter,
  ): Promise<any> {
    return this.locationService.getFarmsPerLocation(org, filters);
  }

  @Post(':org/locationsFilterByType')
  getLocationsFilter(
    @Param('org') org: string,
    @Body() body: string[],
  ): Promise<Location[]> {
    const types = Array.isArray(body) ? body : [body];
    return this.locationService.getCustomizedMany({
      OR: types.map((type) => ({ type })),
    });
  }
  @Get(':org/location-stats')
  getLocationsStats(@Param('org') org: string): Promise<{
    data: { totalCount: number; countsByLevel: Record<LocationLevels, number> };
  }> {
    return this.locationService.getStats();
  }
}
