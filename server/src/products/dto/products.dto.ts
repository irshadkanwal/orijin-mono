import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export abstract class AbstractProduct {
  organisation: string;

  @IsNotEmpty()
  shortCode: string;

  @IsNotEmpty()
  name: string;
}

export class ProductDtoCsv extends AbstractProduct {
  @IsNotEmpty()
  organisation: string;

  @IsNotEmpty()
  productTypeCode: string;

  singleOrigin: string;
  grade: string;
  dry: string;
  organic: string;

  cropVarietyCodes: string;
  originLocationCodes: string;
}

export class ProductDto extends AbstractProduct {
  productTypeId: string;
  productTypeCode: string;
  singleOrigin?: boolean;
  grade?: number;
  dry?: boolean;
  organic?: boolean;

  originVarietyIds?: string[];
  originVarietyId: string;
  originLocationId: string;
}

export class ProductDtoConnected extends AbstractProduct {
  singleOrigin: boolean;
  productType: {
    connect: {
      id: string;
    };
  };
  originVariety?: {
    connect: { id: string };
  };
  // originVarieties?: {
  //   // deleteMany?: any;
  //   create: {
  //     cropVariety: {
  //       connect: { id: string };
  //     };
  //   }[];
  // };
  originLocations?: { create: { location: { connect: { id: string } } }[] };
  originLocation?: { connect: { id: string } };
}

export class AbstractProductTypeDto {
  @IsNotEmpty()
  shortCode: string;

  @IsNotEmpty()
  name: string;
}

export class ProductTypeDtoCsv extends AbstractProductTypeDto {
  @IsNotEmpty()
  organisation: string;

  @IsNotEmpty()
  cropCode?: string;
}

export class ProductTypeDto extends AbstractProductTypeDto {
  organisation: string;

  // Validate EITHER cropId or cropCode, or both if both exist
  @ValidateIf(
    (dto) =>
      typeof dto.cropCode === 'undefined' || (dto.cropId && dto.cropCode),
  )
  @IsString()
  @IsNotEmpty()
  cropId?: string;

  @ValidateIf(
    (dto) => typeof dto.cropId === 'undefined' || (dto.cropId && dto.cropCode),
  )
  @IsString()
  @IsNotEmpty()
  cropCode?: string;
}

export class ProductTypeDtoConnected extends ProductTypeDto {
  crop: {
    connect: {
      id: string;
    };
  };
}
export class AbstractPriceDto {
  organisation: string;

  @IsNotEmpty()
  unit: string;

  @IsNotEmpty()
  perAmountUnit: string;
}

export class PriceDtoCsv extends AbstractPriceDto {
  @IsNotEmpty()
  organisation: string;

  @IsNotEmpty()
  shortCode: string;

  @IsNotEmpty()
  amount: string;

  @IsNotEmpty()
  perAmountAmount: string;

  @IsNotEmpty()
  productCode: string;
}

export class PriceDto extends AbstractPriceDto {
  organisation: string;

  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  perAmountAmount: number;

  productId: string;
  productCode: string;
}
export class PriceDtoConnected extends PriceDto {
  active: boolean;
  product: {
    connect: {
      id: string;
    };
  };
}
