import { Injectable, Logger } from '@nestjs/common';
import { Product } from './models/products.model';
import {
  ProductDto,
  ProductDtoConnected,
  ProductDtoCsv,
} from './dto/products.dto';
import { PrismaService } from 'nestjs-prisma';
import { Product as PrismaProduct } from '@prisma/client';
import AbstractService, {
  parseBooleanForImport,
  parseIntForInport,
} from '../common/service/AbstractService';
import { StandardFilterDto } from '../common/dto/paginationAndSorting.dto';

@Injectable()
export class ProductsService extends AbstractService<
  PrismaProduct,
  Product,
  ProductDtoCsv,
  ProductDto,
  ProductDtoConnected,
  StandardFilterDto
> {
  logger = new Logger(ProductsService.name);

  constructor(protected prisma: PrismaService) {
    super(prisma, prisma.product as any);
  }

  public standardInclude() {
    return { productType: true, originLocation: true, originVariety: true };
  }

  async connectDependenciesForCreateAndUpdate(
    body: ProductDto | ProductDtoCsv,
    isUpdate: boolean,
  ): Promise<ProductDtoConnected> {
    const { productTypeCode, ...rest } = body;

    const csvInput = body as ProductDtoCsv;
    const dtoInput = body as ProductDto;

    const productTypeId = dtoInput.productTypeId;
    const originLocationId = dtoInput.originLocationId;
    const originVarietyId = dtoInput.originVarietyId;
    const cropVarietyCodes = csvInput.cropVarietyCodes;
    const originLocationCodes = csvInput.originLocationCodes;

    delete rest['certificationTypes'];
    // delete rest['singleOrigin'];
    // delete rest['originLocations'];
    delete rest['originFacilities'];
    delete rest['productTypeId'];
    delete rest['cropVarietyCodes'];
    delete rest['originLocationCodes'];
    delete rest['originVarietyId'];
    delete rest['originLocationId'];

    const productTypesStored = await this.prisma.productType.findMany({
      where: {
        AND: [
          { organisation: body.organisation },
          {
            OR: [{ id: productTypeId }, { shortCode: productTypeCode }],
          },
        ],
      },
    });

    if (productTypesStored.length === 0) {
      throw new Error(
        'productType not found for code ' + (productTypeCode || productTypeId),
      );
    }

    const varietiesStored = await this.prisma.cropVariety.findMany({
      where: {
        AND: [
          { organisation: body.organisation },
          {
            OR: [{ id: originVarietyId }],
          },
        ],
      },
    });

    if (varietiesStored.length === 0) {
      throw new Error('crop varieties not found for code ' + originVarietyId);
    }

    const originLocationsStored = await this.prisma.location.findMany({
      where: {
        AND: [
          { organisation: body.organisation },
          {
            OR: [{ id: originLocationId }],
          },
        ],
      },
    });

    if (originLocationsStored.length === 0) {
      throw new Error('location not found for code ' + originLocationsStored);
    }

    const resultValues = {
      ...rest,
      productType: {
        connect: { id: productTypesStored[0].id },
      },
      originVariety: {
        connect: { id: varietiesStored[0].id },
      },
      originLocation: {
        connect: { id: originLocationsStored[0].id },
      },
    } as ProductDtoConnected;

    if (cropVarietyCodes && cropVarietyCodes.length > 0) {
      const varietiesSplit = cropVarietyCodes
        ? (cropVarietyCodes as string).split(';')
        : [];
      const varieties = await Promise.all(
        varietiesSplit.map((p) => {
          return this.prisma.cropVariety.findUnique({
            where: {
              shortCode_organisation: {
                shortCode: p,
                organisation: body.organisation,
              },
            },
          });
        }),
      );
      if (varieties.some((a) => !a?.id)) {
        throw Error('varieties not found ' + cropVarietyCodes);
      }

      //not working for some reason!!
      // originVarieties: {
      //   // deleteMany: {},
      //   create: varieties.map((od) => ({
      //     cropVariety: {
      //       connect: { id: od.id },
      //     },
      //   })),
      // },
      resultValues.originVariety = {
        // deleteMany: {},
        connect: { id: varieties[0].id },
      };
    }

    if (originLocationCodes && originLocationCodes.length > 0) {
      const split = cropVarietyCodes
        ? (originLocationCodes as string).split(';')
        : [];
      const locations = await Promise.all(
        split.map(async (p) => {
          const items = await this.prisma.location.findMany({
            where: {
              AND: [{ organisation: body.organisation }, { shortCode: p }],
            },
          });
          if (items.length !== 1) {
            console.log('LOCATIONS HERE', items);
            throw Error('locations not found ' + p);
          }

          return items[0];
        }),
      );

      //not working for some reason!!
      // resultValues.originLocations = {
      //   // deleteMany: {},
      //   create: locations.map((od) => ({
      //     location: {
      //       connect: { id: od.id, organisation: body.organisation },
      //     },
      //   })),
      // };

      if (!locations[0]) {
        // console.error('locations:' + originLocationCodes, locations);
        // throw Error('locations not found ' + originLocationCodes);
      } else {
        resultValues.originLocation = {
          // deleteMany: {},
          connect: { id: locations[0].id },
        };
      }
    }

    return resultValues as ProductDtoConnected;
  }

  async convertForImport(body: ProductDtoCsv): Promise<ProductDto> {
    const item = await super.convertForImport(body);

    delete body['defaultPackagingContainer'];
    delete body['originFacilityCode'];
    delete body['originFarms'];
    // delete body['originLocationCodes'];

    return {
      ...item,
      singleOrigin: parseBooleanForImport(body.singleOrigin),
      grade: parseIntForInport(body.grade),
      dry: parseBooleanForImport(body.dry),
      organic: parseBooleanForImport(body.organic),
    };
  }
}
