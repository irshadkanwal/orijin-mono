import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  PaginationAndSortingOutputDto,
  StandardFilterDto,
} from '../common/dto/paginationAndSorting.dto';
import { ProductTypesService } from './productTypes.service';
import {
  PriceDto,
  ProductDto,
  ProductTypeDto,
} from '../products/dto/products.dto';
import { Price, Product, ProductType } from '../products/models/products.model';
import { ProductPriceService } from './productPrice.service';

@Controller()
export class ProductsController {
  constructor(
    private readonly productService: ProductsService,
    private readonly productTypesService: ProductTypesService,
    private readonly productPriceService: ProductPriceService,
  ) {}

  @Post(':org/products') // TODO: Mini thing, should we use plural or singular?
  createProduct(
    @Param('org') org: string,
    @Body() body: ProductDto,
  ): Promise<Product> {
    body.organisation = org;
    return this.productService.create(body);
  }

  @Patch(':org/products/:id')
  updateProduct(
    @Param('org') org: string,
    @Param('id') id: string,
    @Body() body: ProductDto,
  ): Promise<Product> {
    return this.productService.update(id, body);
  }

  @Delete(':org/products/:id')
  deleteProduct(
    @Param('org') org: string,
    @Param('id') id: string,
  ): Promise<{ sucess: boolean }> {
    return this.productService.delete(id);
  }

  @Get(':org/products/:id')
  getProduct(
    @Param('org') org: string,
    @Param('id') id: string,
  ): Promise<Product> {
    return this.productService.getOne({
      id,
      org: org,
    });
  }

  @Get(':org/products')
  getProducts(
    @Param('org') org: string,
    @Query() params: StandardFilterDto,
  ): Promise<PaginationAndSortingOutputDto<Product>> {
    params.organisation = org;
    return this.productService.getMany({
      organisation: org,
    });
  }

  @Get(':org/product-types/:id')
  getProductType(
    @Param('org') org: string,
    @Param('id') id: string,
  ): Promise<ProductType> {
    return this.productTypesService.getOne({
      id,
      org: org,
    });
  }

  @Post(':org/product-types') // TODO: Mini thing, should we use plural or singular?
  createProductType(
    @Param('org') org: string,
    @Body() body: ProductTypeDto,
  ): Promise<ProductType> {
    body.organisation = org;
    return this.productTypesService.create(body);
  }

  @Patch(':org/product-types/:id')
  updateProductType(
    @Param('org') org: string,
    @Param('id') id: string,
    @Body() body: ProductTypeDto,
  ): Promise<ProductType> {
    return this.productTypesService.update(id, body);
  }

  @Delete(':org/product-types/:id')
  deleteProductType(
    @Param('org') org: string,
    @Param('id') id: string,
  ): Promise<{ sucess: boolean }> {
    return this.productTypesService.delete(id);
  }

  @Get(':org/product-types')
  getProductTypes(
    @Param('org') org: string,
    @Query() params: StandardFilterDto,
  ): Promise<PaginationAndSortingOutputDto<ProductType>> {
    params.organisation = org;
    return this.productTypesService.getMany({
      organisation: org,
    });
  }

  @Post(':org/prices') // TODO: Mini thing, should we use plural or singular?
  createPrice(
    @Param('org') org: string,
    @Body() body: PriceDto,
  ): Promise<Price> {
    body.organisation = org;
    return this.productPriceService.create(body);
  }

  @Patch(':org/prices/:id')
  updatePrice(
    @Param('org') org: string,
    @Param('id') id: string,
    @Body() body: PriceDto,
  ): Promise<Price> {
    return this.productPriceService.update(id, body);
  }

  @Delete(':org/prices/:id')
  deletePrice(
    @Param('org') org: string,
    @Param('id') id: string,
  ): Promise<{ sucess: boolean }> {
    return this.productPriceService.delete(id);
  }

  @Get(':org/prices/:id')
  getPrice(@Param('org') org: string, @Param('id') id: string): Promise<Price> {
    return this.productPriceService.getOne({
      id,
      org: org,
    });
  }

  @Get(':org/prices')
  getPrices(
    @Param('org') org: string,
    @Query() params: StandardFilterDto,
  ): Promise<PaginationAndSortingOutputDto<Price>> {
    params.organisation = org;
    return this.productPriceService.getMany({
      organisation: org,
    });
  }
}
