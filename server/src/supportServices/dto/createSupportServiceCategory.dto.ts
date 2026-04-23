import { IsNotEmpty, IsString } from 'class-validator';

// import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

export class AbstractDto {
  organisation: string;

  @IsNotEmpty()
  shortCode: string;

  @IsNotEmpty()
  name: string;

  @IsString()
  description: string | null;
}

export class CreateSupportServiceCategoryDtoCsv extends AbstractDto {
  @IsNotEmpty()
  organisation: string;

  @IsNotEmpty()
  supportingServiceCategoryTypeCode: string;
}

export class CreateSupportServiceCategoryDto extends AbstractDto {
  organisation: string;

  @IsNotEmpty()
  @IsString()
  supportingServiceCategoryTypeId: string; // In reality "ServiceCategoryType"

  supportingServiceCategoryTypeCode: string;

  service: string;
}

export class CreateSupportServiceCategoryDtoConnected extends CreateSupportServiceCategoryDto {
  supportingServiceCategoryType: {
    connect: { id: string };
  };
}
