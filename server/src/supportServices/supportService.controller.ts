import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { SupportServiceCategoryService } from './supportServiceCategory.service';
import { SupportServiceActivityService } from './supportServiceActivity.service';
import {
  SupportServiceActivity,
  SupportServiceActivityType,
  SupportServiceCategory,
  SupportServiceCategoryType,
  SupportServiceInputType,
} from './models/supportService.model';
import { SupportServiceCategoryTypeService } from './supportServiceCategoryType.service';
import { CreateSupportServiceActivityDto } from './dto/createSupportServiceActivity.dto';
import { UpdateSupportServiceActivityDto } from './dto/updateSupportServiceActivity.dto';
import { CreateSupportServiceCategoryDto } from './dto/createSupportServiceCategory.dto';
import { UpdateSupportServiceCategoryDto } from './dto/updateSupportServiceCategory.dto';
import {
  PaginationAndSortingOutputDto,
  StandardFilterDto,
} from '../common/dto/paginationAndSorting.dto';
import { SupportServiceCategoryTypesFilterDto } from './dto/supportServiceCategoryTypes.filter.dto';
import { SupportServiceActivityFilterDto } from './dto/supportServiceActivity.filter.dto';
import { CreateServiceCategoryTypeValues } from './dto/createSupportServiceCategoryType.dto';
import { SupportServiceInputTypeService } from './supportServiceInputType.service';
import { SupportServiceActivityTypeService } from './supportServiceActivityType.service';
import {
  SupportServiceInputTypeDto,
  SupportServiceInputTypesFilterDto,
} from './dto/supportServiceInputType.dto';
import {
  SupportServiceActivityTypeDto,
  SupportServiceActivityTypesFilterDto,
} from './dto/supportServiceActivityType.dto';
import { Response } from 'express';
import { SupportServiceCategoryFilterDto } from './dto/supportServiceCategory.filter.dto';
import { re } from 'mathjs';

@Controller()
export class SupportServiceController {
  constructor(
    private readonly supportServiceCategoryTypeService: SupportServiceCategoryTypeService,
    private readonly supportServiceCategoryService: SupportServiceCategoryService,
    private readonly supportServiceInputTypeService: SupportServiceInputTypeService,
    private readonly supportServiceActivityTypeService: SupportServiceActivityTypeService,
    private readonly supportServiceActivityService: SupportServiceActivityService,
  ) {}

  //////
  // Support Service Category Types - just named wrong in v1 at the moment
  //////

  @Post(':org/service-category-types')
  postServiceCategoryType(
    @Param('org') org: string,
    @Body() body: CreateServiceCategoryTypeValues,
  ): Promise<SupportServiceCategoryType> {
    body.organisation = org;
    return this.supportServiceCategoryTypeService.create(body);
  }

  @Get(':org/service-category-types')
  getServiceCategoryTypes(
    @Param('org') org: string,
    @Query() filters: SupportServiceCategoryTypesFilterDto,
  ): Promise<PaginationAndSortingOutputDto<SupportServiceCategoryType>> {
    filters.organisation = org;
    return this.supportServiceCategoryTypeService.getMany(filters);
  }

  @Get(':org/service-category-types/:id')
  getServiceCategoryType(
    @Param('org') org: string,
    @Param('id') id: string,
  ): Promise<SupportServiceCategoryType> {
    return this.supportServiceCategoryTypeService.getOne({
      id,
      org: org,
    });
  }

  @Patch(':org/service-category-types/:id')
  updateServiceCategoryType(
    @Param('org') org: string,
    @Param('id') id: string,
    @Body() body: CreateServiceCategoryTypeValues,
  ): Promise<SupportServiceCategoryType> {
    body.organisation = org;
    return this.supportServiceCategoryTypeService.update(
      id,
      body as any as CreateSupportServiceCategoryDto,
    );
  }

  @Delete(':org/service-category-types/:id')
  async deleteServiceCategoryType(
    @Res() res: Response,
    @Param('org') org: string,
    @Param('id') id: string,
  ) {
    const resp = await this.supportServiceCategoryTypeService.delete(id);
    if (resp.sucess) {
      return res.status(HttpStatus.OK).json(resp);
    } else {
      // Handle error response
      return res.status(HttpStatus.BAD_REQUEST).json(resp);
    }
  }

  //////
  // Support Service Categories
  //////

  @Post(':org/service-categories') // TODO: Mini thing, should we use plural or singular?
  postServiceCategory(
    @Param('org') org: string,
    @Body() body: CreateSupportServiceCategoryDto,
  ): any {
    body.organisation = org;
    return this.supportServiceCategoryService.create(body);
  }

  @Get(':org/service-categories')
  getServiceCategories(
    @Param('org') org: string,
    @Query() filters: SupportServiceCategoryFilterDto,
  ): Promise<PaginationAndSortingOutputDto<SupportServiceCategory>> {
    filters.organisation = org;
    return this.supportServiceCategoryService.getMany(filters);
  }

  @Get(':org/service-categories/:id')
  getServiceCategory(
    @Param('org') org: string,
    @Param('id') id: string,
  ): Promise<SupportServiceCategory> {
    return this.supportServiceCategoryTypeService.getOne({
      id,
      org: org,
    });
  }

  @Patch(':org/service-categories/:id')
  updateServiceCategory(
    @Param('org') org: string,
    @Param('id') id: string,
    @Body() body: UpdateSupportServiceCategoryDto,
  ): Promise<SupportServiceCategory> {
    body.organisation = org;
    return this.supportServiceCategoryService.update(
      id,
      body as any as CreateSupportServiceCategoryDto,
    );
  }

  @Delete(':org/service-categories/:id')
  async deleteServiceCategory(
    @Res() res: Response,
    @Param('org') org: string,
    @Param('id') id: string,
  ) {
    const resp = await this.supportServiceCategoryService.delete(id);
    if (resp.sucess) {
      return res.status(HttpStatus.OK).json(resp);
    } else {
      // Handle error response
      return res.status(HttpStatus.BAD_REQUEST).json(resp);
    }
  }

  //////
  // Support Service Activities
  //////

  @Get(':org/serviceactivities')
  async getServiceActivities(
    @Param('org') org: string,
    @Query() filters: SupportServiceActivityFilterDto,
  ): Promise<PaginationAndSortingOutputDto<SupportServiceActivity>> {
    filters.organisation = org;
    const response = await this.supportServiceActivityService.getMany(filters);
    const data = response.data.map((item) => {
      return {
        ...item,
        farmerGroupIds:
          item.serviceActivityLocations?.map((x) => x.locationId) ?? [],
        personIds:
          item.ServiceActivityBeneficiaries?.map((x) => x.personId) ?? [],
        itemsProcessed: item.ServiceActivityBeneficiaries?.[0]?.itemsProcessed,
        itemValue: item.ServiceActivityBeneficiaries?.[0]?.itemValue,
        score: item.ServiceActivityBeneficiaries?.[0]?.score,
        total: item.ServiceActivityBeneficiaries?.[0]?.total,
      };
    });
    return { data, count: response.count };
  }

  @Get(':org/serviceactivities/:id')
  getServiceActivity(
    @Param('org') org: string,
    @Param('id') id: string,
  ): Promise<SupportServiceActivity> {
    return this.supportServiceActivityService.getOne({
      id,
      org: org,
    });
  }

  @Post(':org/serviceactivities')
  postServiceActivity(
    @Param('org') org: string,
    @Body() body: CreateSupportServiceActivityDto,
  ): Promise<SupportServiceActivity> {
    body.organisation = org;
    return this.supportServiceActivityService.create(body);
  }

  @Patch(':org/serviceactivities/:id')
  updateServiceActivity(
    @Param('org') org: string,
    @Param('id') id: string,
    @Body() body: UpdateSupportServiceActivityDto,
  ): Promise<SupportServiceActivity> {
    body.organisation = org;
    return this.supportServiceActivityService.update(
      id,
      body as CreateSupportServiceActivityDto,
    );
  }

  @Delete(':org/serviceactivities/:id')
  async deleteServiceActivity(
    @Res() res: Response,
    @Param('org') org: string,
    @Param('id') id: string,
  ) {
    const resp = await this.supportServiceActivityService.delete(id);
    if (resp.sucess) {
      return res.status(HttpStatus.OK).json(resp);
    } else {
      // Handle error response
      return res.status(HttpStatus.BAD_REQUEST).json(resp);
    }
  }

  //////
  // Support Service Input Types
  //////
  @Get(':org/service-input-types')
  getServiceInputs(
    @Param('org') org: string,
    @Query() filters: SupportServiceInputTypesFilterDto,
  ): Promise<PaginationAndSortingOutputDto<SupportServiceInputType>> {
    filters.organisation = org;
    return this.supportServiceInputTypeService.getMany(filters);
  }

  @Get(':org/service-input-types/:id')
  getServiceInputType(
    @Param('org') org: string,
    @Param('id') id: string,
  ): Promise<SupportServiceInputType> {
    return this.supportServiceInputTypeService.getOne({
      id,
      org: org,
    });
  }

  @Post(':org/service-input-types')
  postServiceInputType(
    @Param('org') org: string,
    @Body() body: SupportServiceInputTypeDto,
  ): Promise<SupportServiceInputType> {
    body.organisation = org;
    return this.supportServiceInputTypeService.create(body);
  }

  @Patch(':org/service-input-types/:id')
  updateServiceInputType(
    @Param('org') org: string,
    @Param('id') id: string,
    @Body() body: SupportServiceInputTypeDto,
  ): Promise<SupportServiceInputType> {
    body.organisation = org;
    return this.supportServiceInputTypeService.update(id, body);
  }

  @Delete(':org/service-input-types/:id')
  async deleteServiceInputType(
    @Res() res: Response,
    @Param('org') org: string,
    @Param('id') id: string,
  ) {
    const resp = await this.supportServiceInputTypeService.delete(id);
    if (resp.sucess) {
      return res.status(HttpStatus.OK).json(resp);
    } else {
      // Handle error response
      return res.status(HttpStatus.BAD_REQUEST).json(resp);
    }
  }

  //////
  // Support Service actiivty Types
  //////

  @Get(':org/service-activity-types')
  getServiceActivityTypes(
    @Param('org') org: string,
    @Query() filters: SupportServiceActivityTypesFilterDto,
  ): Promise<PaginationAndSortingOutputDto<SupportServiceActivityType>> {
    filters.organisation = org;
    return this.supportServiceActivityTypeService.getMany(filters);
  }

  @Get(':org/service-activity-types/:id')
  getServiceActivityType(
    @Param('org') org: string,
    @Param('id') id: string,
  ): Promise<SupportServiceActivityType> {
    return this.supportServiceActivityTypeService.getOne({
      id,
      org: org,
    });
  }

  @Post(':org/service-activity-types')
  postServiceActivityType(
    @Param('org') org: string,
    @Body() body: SupportServiceActivityTypeDto,
  ): Promise<SupportServiceActivityType> {
    body.organisation = org;
    return this.supportServiceActivityTypeService.create(body);
  }

  @Patch(':org/service-activity-types/:id')
  updateServiceActivityType(
    @Param('org') org: string,
    @Param('id') id: string,
    @Body() body: SupportServiceActivityTypeDto,
  ): Promise<SupportServiceActivityType> {
    body.organisation = org;
    return this.supportServiceActivityTypeService.update(id, body);
  }

  @Delete(':org/service-activity-types/:id')
  async deleteServiceActivityType(
    @Res() res: Response,
    @Param('org') org: string,
    @Param('id') id: string,
  ) {
    const resp = await this.supportServiceActivityTypeService.delete(id);
    if (resp.sucess) {
      return res.status(HttpStatus.OK).json(resp);
    } else {
      // Handle error response
      return res.status(HttpStatus.BAD_REQUEST).json(resp);
    }
  }
}
