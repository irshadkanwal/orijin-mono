import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Polygon } from './models/geodatas.model';
import { PolygonService } from './geopolygon.service';
import { PatchPolygonDto, PolygonDto } from './dto/geodatasDto';
import {
  PaginationAndSortingOutputDto,
  StandardFilterDto,
} from '../common/dto/paginationAndSorting.dto';

@Controller()
export class GeodatasController {
  constructor(private readonly geoPolygonService: PolygonService) {}

  @Post(':org/geopolygons')
  postGeoData(
    @Param('org') org: string,
    @Body() body: PolygonDto,
  ): Promise<Polygon> {
    body.organisation = org;
    return this.geoPolygonService.create(body);
  }

  @Get(':org/geopolygons')
  getVarieties(
    @Param('org') org: string,
    @Query() filters: StandardFilterDto,
  ): Promise<PaginationAndSortingOutputDto<Polygon>> {
    filters.organisation = org;
    return this.geoPolygonService.getMany(filters);
  }

  @Get(':org/geopolygons/:id')
  getGeoData(
    @Param('org') org: string,
    @Param('id') id: string,
  ): Promise<Polygon> {
    return this.geoPolygonService.getOne({ id, org });
  }

  @Patch('geopolygons/:id')
  updateGeoData(
    @Body() body: PolygonDto,
    @Param('id') id: string,
  ): Promise<Polygon> {
    const { active } = body;
    return this.geoPolygonService.updatePolygon(id, {
      active,
    });
  }
}
