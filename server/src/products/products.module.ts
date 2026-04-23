import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductTypesService } from './productTypes.service';
import { ProductPriceService } from './productPrice.service';

@Module({
  imports: [],
  controllers: [ProductsController],
  providers: [ProductsService, ProductTypesService, ProductPriceService],
  exports: [ProductsService, ProductTypesService, ProductPriceService],
})
export class ProductsModule {}
