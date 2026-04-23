import { Injectable, Logger } from '@nestjs/common';
import { ProductsService } from '../../products/products.service';
import { AbstractExporter } from './AbstractExporter';
import { Price } from '../../products/models/products.model';
import { FirestoreService } from '../firestore.service';
import { ProductPriceService } from '../../products/productPrice.service';
import VarietyPriceV1 from '../v1entities/refdata/VarietyPriceV1';
import PriceContainer from '../v1entities/utis/PriceContainer';
import AmountUnit from '../v1entities/utis/AmountUnit';
import { Meta } from '../v1entities/utis/types';
import { setupIdFields } from './../v1utils/utils';
import { ObjectId } from '../v1entities/utis/ObjectId';
import { PrismaService } from 'nestjs-prisma';
import OrmProvider from "../v1services/OrmProvider";

@Injectable()
export class FirestoreProductPriceExporterService extends AbstractExporter<
  Price,
  VarietyPriceV1,
  ProductPriceService
> {
  private logger = new Logger(FirestoreProductPriceExporterService.name);

  constructor(
    protected firestoreService: OrmProvider,
    protected myService: ProductPriceService,
    protected pProductsService: ProductsService,
    protected prisma: PrismaService,
  ) {
    super(firestoreService, myService);
  }

  async transform(input: Price, meta: Meta): Promise<VarietyPriceV1> {
    const res = new VarietyPriceV1();
    setupIdFields(res, input, meta);

    const product = await this.pProductsService.getOne({
      id: input.productId,
      org: meta.organisation,
    });

    res.id.label = product.name;
    res.name = product.name;

    const variety = await this.prisma.cropVariety.findUnique({
      where: { id: product.originVarietyId, deletedAt: null },
    });

    res.variety = new ObjectId(
      product.originVarietyId,
      'varieties',
      variety.shortCode,
    );
    res.variety.label = variety.name;
    res.price = new PriceContainer();
    res.price.price = new AmountUnit(input.amount.toNumber(), input.unit);
    res.price.perWeight = new AmountUnit(
      input.perAmountAmount.toNumber(),
      input.perAmountUnit,
    );

    return res;
  }
}
