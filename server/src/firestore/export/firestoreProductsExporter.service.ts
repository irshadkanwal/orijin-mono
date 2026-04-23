import { Injectable, Logger } from '@nestjs/common';
import { ProductsService } from '../../products/products.service';
import { AbstractExporter } from './AbstractExporter';
import ProductV1 from '../v1entities/refdata/ProductV1';
import { Product } from '../../products/models/products.model';
import { ObjectId } from '../v1entities/utis/ObjectId';
import { Meta } from '../v1entities/utis/types';
import { setupIdFields } from './../v1utils/utils';
import { PrismaService } from 'nestjs-prisma';
import OrmProvider from '../v1services/OrmProvider';

@Injectable()
export class FirestoreProductsExporterService extends AbstractExporter<
  Product,
  ProductV1,
  ProductsService
> {
  private logger = new Logger(FirestoreProductsExporterService.name);

  constructor(
    protected firestoreService: OrmProvider,
    protected myService: ProductsService,
    protected prisma: PrismaService,
  ) {
    super(firestoreService, myService);
  }

  async transform(input: Product, meta: Meta): Promise<ProductV1> {
    const res = new ProductV1();
    setupIdFields(res, input, meta);

    res.id.label = input.name;
    res.name = input.name;

    res.name = input.name;
    res.sku = input.sku;
    res.organic = input.organic;
    res.dry = input.dry;

    if (input.originVariety) {
      const varietyId = new ObjectId(input.originVariety.id, 'varieties');
      varietyId.labelShort = input.originVariety.shortCode;
      varietyId.label = input.originVariety.name;
      res.variety = varietyId;
    }

    const prices = await this.prisma.price.findMany({
      where: {
        organisation: meta.organisation,
        productId: input.id,
      },
    });
    if (prices && prices.length == 1) {
      const priceId = new ObjectId(prices[0].id, 'varietyprices');
      priceId.labelShort = input.shortCode;
      priceId.label = input.name;
      res.varietyPrice = priceId;
    }

    if (input.originLocation) {
      const originLocationId = new ObjectId(
        input.originLocation.id,
        'locations',
      );
      originLocationId.labelShort = input.originLocation.shortCode;
      originLocationId.label = input.originLocation.name;
      //DISTRICT
      res.originLocation = originLocationId;
    }
    // res.crop = new ObjectId('', '', '');
    // res.originFacility = '';
    // res.originProducer = '';
    // res.price = '';
    // res.type = '';
    // res.singleOrigin = '';
    return res;
  }
}
