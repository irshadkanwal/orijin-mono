import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { CertificationsService } from './certifications.service';
import { CertificationTypeService } from './certificationType.service';
import {
  PaginationAndSortingOutputDto,
  StandardFilterDto,
} from '../common/dto/paginationAndSorting.dto';
import { CertificationTypeDto } from './dto/certifications.dto';
import { CertificationType } from './models/certifications.model';

@Controller()
export class CertificationsController {
  constructor(
    private readonly certificationService: CertificationsService,
    private readonly certificationTypeService: CertificationTypeService,
  ) { }
  @Get(':org/certification-types')
  getAllCertificateType(
    @Param('org') org: string,
    @Query() filters: StandardFilterDto,
  ): Promise<PaginationAndSortingOutputDto<CertificationType>> {
    filters.organisation = org;
    return this.certificationTypeService.getMany(filters);
  }

  @Get(':org/certification-types/:id')
  getCertificateType(
    @Param('org') org: string,
    @Param('id') id: string,
  ): Promise<CertificationType> {
    return this.certificationTypeService.getOne({
      id,
      org: org,
    });
  }

  @Post(':org/certification-types') // TODO: Mini thing, should we use plural or singular?
  createCertificateType(
    @Param('org') org: string,
    @Body() body: CertificationTypeDto,
  ): Promise<CertificationType> {
    body.organisation = org;
    return this.certificationTypeService.create(body);
  }

  @Delete(':org/certification-types/:id')
  deleteCertificateType(
    @Param('org') org: string,
    @Param('id') id: string,
  ): Promise<{ sucess: boolean }> {
    return this.certificationTypeService.delete(id);
  }
}
