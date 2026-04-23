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
import { CropsService } from './crops.service';
import { CropvarietyService } from './cropvariety.service';
import { CropVarietyDto } from './dto/crops.dto';
import {
  PaginationAndSortingOutputDto,
  StandardFilterDto,
} from '../common/dto/paginationAndSorting.dto';
import { CropsDto } from '../crops/dto/crops.dto';
import { Crop, Variety } from '../crops/models/crops.model';
import { CropVarietyFilter } from './dto/crops.filter.dto';

@Controller()
export class CropsController {
  constructor(
    private readonly cropService: CropsService,
    private readonly cropVarietyService: CropvarietyService,
  ) {}

  @Post(':org/crops') // TODO: Mini thing, should we use plural or singular?
  createCrop(@Param('org') org: string, @Body() body: CropsDto): Promise<Crop> {
    body.organisation = org;
    return this.cropService.create(body);
  }

  @Patch(':org/crops/:id')
  updateCrop(
    @Param('org') org: string,
    @Param('id') id: string,
    @Body() body: CropsDto,
  ): Promise<Crop> {
    return this.cropService.update(id, body);
  }

  @Delete(':org/crops/:id')
  deleteCrop(
    @Param('org') org: string,
    @Param('id') id: string,
  ): Promise<{ sucess: boolean }> {
    return this.cropService.delete(id);
  }

  @Get(':org/crops/:id')
  getCrop(@Param('org') org: string, @Param('id') id: string): Promise<Crop> {
    return this.cropService.getOne({
      id,
      org: org,
    });
  }

  @Get(':org/crops')
  getCrops(
    @Param('org') org: string,
    @Query() filters: StandardFilterDto,
  ): Promise<PaginationAndSortingOutputDto<Crop>> {
    filters.organisation = org;
    return this.cropService.getMany(filters);
  }

  @Post(':org/crop-varieties') // TODO: Mini thing, should we use plural or singular?
  createCropVariety(
    @Param('org') org: string,
    @Body() body: CropVarietyDto,
  ): Promise<Variety> {
    body.organisation = org;
    return this.cropVarietyService.create(body);
  }

  @Patch(':org/crop-varieties/:id')
  updateCropVariety(
    @Param('org') org: string,
    @Param('id') id: string,
    @Body() body: CropVarietyDto,
  ): Promise<Variety> {
    return this.cropVarietyService.update(id, body);
  }

  @Delete(':org/crop-varieties/:id')
  deleteCropVariety(
    @Param('org') org: string,
    @Param('id') id: string,
  ): Promise<{ sucess: boolean }> {
    return this.cropVarietyService.delete(id);
  }

  @Get(':org/crop-varieties/:id')
  getCropVariety(
    @Param('org') org: string,
    @Param('id') id: string,
  ): Promise<Variety> {
    return this.cropVarietyService.getOne({
      id,
      org: org,
    });
  }

  @Get(':org/crop-varieties')
  getCropVarieties(
    @Param('org') org: string,
    @Query() params: CropVarietyFilter,
  ): Promise<PaginationAndSortingOutputDto<Variety>> {
    params.organisation = org;
    return this.cropVarietyService.getMany(params);
  }
}
