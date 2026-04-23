import { Controller, Get, Param } from '@nestjs/common';
import { FiltersService } from './filters.service';

@Controller()
export class FiltersController {
  constructor(private readonly filtersService: FiltersService) {}

  @Get('filters/:filterKey')
  async getFilters(@Param('filterKey') filterKey: string) {
    return this.filtersService.getFilters(filterKey);
  }

  @Get(':orgId/filters/:filterKey')
  getOrgFilters(
    @Param('filterKey') filterKey: string,
    @Param('orgId') orgId: string,
  ) {
    return this.filtersService.getFilters(filterKey, orgId);
  }
}
