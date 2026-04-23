import { Injectable, Logger } from '@nestjs/common';
import { ProductsService } from '../../products/products.service';
import { ProductTypesService } from '../../products/productTypes.service';
import { AbstractExporter } from './AbstractExporter';
import { Product } from '../../products/models/products.model';
import ProductV1 from '../v1entities/refdata/ProductV1';
import { Meta } from '../v1entities/utis/types';
import { setupIdFields } from '../v1utils/utils';
import OrmProvider from '../v1services/OrmProvider';

@Injectable()
export class FirestoreProductTypeExporterService extends AbstractExporter<
  Product,
  ProductV1,
  ProductsService
> {
  private logger = new Logger(FirestoreProductTypeExporterService.name);

  constructor(
    protected firestoreService: OrmProvider,
    protected myService: ProductsService,
    productTypesService: ProductTypesService,
  ) {
    super(firestoreService, myService);
  }

  async transform(input: Product, meta: Meta): Promise<ProductV1> {
    const res = new ProductV1();
    setupIdFields(res, input, meta);
    res.id.label = input.name;
    res.name = input.name;

    return res;
  }
}
