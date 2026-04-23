import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CountItem, Farm, FarmMinimal } from './models/farms.model';
import { FarmsService } from './farms.service';
import { PlotsService } from './plots.service';
import { CountItemService } from './countItem.service';
import { FarmsDto, PlotDto } from './dto/farms.dto';
import { Plot } from './models/plots.model';
import { FarmStatsService } from './farm.stats.service';
import {
  PaginationAndSortingOutputDto,
  StandardFilterDto,
} from '../common/dto/paginationAndSorting.dto';
import { FarmsFilter } from './dto/farms.filter.dto';
import { SeasonsService } from '../../src/seasons/seasons.service';
import { PlotsFilter } from './dto/plots.filter.dto';

@Controller()
export class FarmsController {
  logger = new Logger(FarmsController.name);

  constructor(
    private readonly farmService: FarmsService,
    private readonly plotsService: PlotsService,
    private readonly plotCountItemService: CountItemService,
    private readonly farmStatsService: FarmStatsService,
    private readonly seasonService: SeasonsService,
  ) {}

  // Plot count - is this used?

  // @Post('countitems')
  // postCountItem(@Body() body): Promise<CountItem> {
  //   return this.plotCountItemService.create(body);
  // }

  @Get('countitems')
  getPlotsCountItem(): Promise<CountItem[]> {
    return this.plotCountItemService.getAll();
  }

  @Get('countitems/:id')
  getCountItem(@Param('id') id: string): Promise<CountItem> {
    return this.plotCountItemService.getOne(id);
  }

  // Plots

  @Post('plots')
  postPlot(@Body() body: PlotDto): Promise<Plot> {
    return this.plotsService.upsert(body);
  }

  // Polygons

  @Post('autofix-polygons')
  autofixAndStore(
    @Body()
    body: {
      polygonCoordinates: number[][];
      polygonSource: any;
      plotShortCode: any;
    },
  ): Promise<any[]> {
    return this.plotsService.autofixAndStorePolygons(
      body.polygonCoordinates,
      body.polygonSource,
      body.plotShortCode,
    );
  }

  @Get(':org/plots/:id')
  getPlot(
    @Param('org') org: string, //
    @Param('id') id: string,
  ): Promise<Plot> {
    // TODO: Confirm that the org is the same as the parent farm
    return this.plotsService.getOne(id);
  }

  @Get(':org/plots')
  getVessels(
    @Param('org') org: string,
    @Query() filters: PlotsFilter,
  ): Promise<Plot[]> {
    filters.organisation = org;
    return this.plotsService.getMany(filters);
  }

  // Farms

  @Post('farms')
  postFarm(@Body() body: FarmsDto): Promise<Farm> {
    return this.farmService.create(body);
  }

  @Get(':org/farms')
  getFarmsOrg(
    @Param('org') org: string,
    @Query() filters: FarmsFilter,
  ): Promise<{ data: Farm[]; count: number; chartData?: any }> {
    filters.organisation = org;
    return this.farmService.getMany(filters);
  }

  @Get(':org/farms-minimal')
  getFarmsOrgMinimal(
    @Param('org') org: string,
    @Query() filters: FarmsFilter,
  ): Promise<{ data: FarmMinimal[]; count: number; chartData?: any }> {
    filters.organisation = org;
    return this.farmService.getManyImpl(filters, { minimalData: true });
  }

  @Get(':org/farms/:id')
  getFarmOrg(
    @Param('org') org: string,
    @Param('id') id: string,
  ): Promise<Farm> {
    return this.farmService.getOne({ id, org });
  }

  @Get(':org/farm-stats')
  async getFarmStats(
    @Param('org') org: string,
    @Query() filters?: FarmsFilter,
  ): Promise<any> {
    filters.organisation = org;
    return this.farmStatsService.getStats(filters);
  }

  @Get(':org/farm/seasons/:id')
  async getFarmSeasons(
    @Param('org') org: string,
    @Param('id') id: string,
  ): Promise<any> {
    const currentFarm = await this.farmService.getOne({ id, org });
    const seasons = await this.seasonService.getMany({
      organisation: org,
      sort: 'shortCode',
    });

    return Promise.all(
      seasons.data.map((s) =>
        this.farmService
          .getOne({
            org,
            shortCode: currentFarm.facility.shortCode,
            seasonId: s.id,
          })
          .then((maybeSeasonFarm) => ({
            seasonId: s.id,
            seasonCode: s.shortCode,
            farmId: maybeSeasonFarm?.id,
          })),
      ),
    );
  }

  @Get(':org/farm/season/history/:id')
  async getFarmSeasonsHistory(
    @Param('org') org: string,
    @Param('id') id: string,
  ): Promise<any> {
    const currentFarm = await this.farmService.getOne({ id, org });

    const seasons = await this.seasonService.getMany({
      organisation: org,
      sort: 'shortCode',
    });

    return Promise.all(
      seasons.data.map((s) =>
        this.farmService
          .getOne({
            org,
            shortCode: currentFarm.facility.shortCode,
            seasonId: s.id,
          })
          .then((maybeSeasonFarm) => ({
            seasonId: s.id,
            seasonCode: s.shortCode,
            farm: maybeSeasonFarm,
          })),
      ),
    );
  }
}
