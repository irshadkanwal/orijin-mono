import {
  IsArray,
  IsDateString,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  isString,
  IsString,
} from 'class-validator';

export class AbstractDto {
  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  beneficiaryType: string;
}

export class CreateSupportServiceActivityDtoCsv extends AbstractDto {
  @IsNotEmpty()
  organisation: string;

  @IsNotEmpty()
  shortCode: string;

  @IsNotEmpty()
  operator: string;

  @IsDateString()
  @IsNotEmpty()
  dateOfService: string;

  @IsNotEmpty()
  supportingServiceCategoryCode: string;

  @IsNotEmpty()
  supportingServiceActivityTypeCode: string;

  supportingServiceInputTypeCode: string;

  @IsString()
  @IsNotEmpty()
  locationCode: string;

  farmerGroupCodes: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  supportingServiceCategoryTypeCode: string;
}

export class CreateSupportServiceActivityDto extends AbstractDto {
  @IsOptional()
  organisation: string;

  @IsString()
  @IsNotEmpty()
  operator: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  farmerGroupIds: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  personIds: string[];

  @IsDateString()
  @IsNotEmpty()
  dateOfService: Date;

  @IsString()
  @IsNotEmpty()
  supportingServiceCategoryId: string;

  supportingServiceCategoryCode: string;

  @IsString()
  @IsNotEmpty()
  supportingServiceActivityTypeId: string;

  supportingServiceActivityTypeCode: string;

  supportingServiceInputTypeId: string;
  supportingServiceInputTypeCode: string;

  @IsString()
  @IsOptional()
  locationId: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  supportingServiceCategoryTypeId: string;
  supportingServiceCategoryTypeCode: string;

  @IsNumber()
  @IsOptional()
  itemsProcessed?: number;

  @IsNumber()
  @IsOptional()
  itemValue?: number;

  @IsNumber()
  @IsOptional()
  score?: number;

  @IsNumber()
  @IsOptional()
  total?: number;
}

export class CreateSupportServiceActivityDtoConnected extends CreateSupportServiceActivityDto {
  supportingServiceCategory: {
    connect: { id: string };
  };
  supportingServiceInputType?: {
    connect: { id: string };
  };
  supportingServiceActivityType: {
    connect: { id: string };
  };
  // location?: {
  //   connect: { id: string };
  // };
  ServiceActivityBeneficiaries: {
    deleteMany: any;
    create?: {
      person: {
        connect: { id: string };
      };
      primary?: boolean;
    }[];
  };
}
