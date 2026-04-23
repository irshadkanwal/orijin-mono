"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProductsController", {
    enumerable: true,
    get: function() {
        return ProductsController;
    }
});
const _common = require("@nestjs/common");
const _productsservice = require("./products.service");
const _paginationAndSortingdto = require("../common/dto/paginationAndSorting.dto");
const _productTypesservice = require("./productTypes.service");
const _productsdto = require("./dto/products.dto");
const _productPriceservice = require("./productPrice.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let ProductsController = class ProductsController {
    createProduct(org, body) {
        body.organisation = org;
        return this.productService.create(body);
    }
    updateProduct(org, id, body) {
        return this.productService.update(id, body);
    }
    deleteProduct(org, id) {
        return this.productService.delete(id);
    }
    getProduct(org, id) {
        return this.productService.getOne({
            id,
            org: org
        });
    }
    getProducts(org, params) {
        params.organisation = org;
        return this.productService.getMany({
            organisation: org
        });
    }
    getProductType(org, id) {
        return this.productTypesService.getOne({
            id,
            org: org
        });
    }
    createProductType(org, body) {
        body.organisation = org;
        return this.productTypesService.create(body);
    }
    updateProductType(org, id, body) {
        return this.productTypesService.update(id, body);
    }
    deleteProductType(org, id) {
        return this.productTypesService.delete(id);
    }
    getProductTypes(org, params) {
        params.organisation = org;
        return this.productTypesService.getMany({
            organisation: org
        });
    }
    createPrice(org, body) {
        body.organisation = org;
        return this.productPriceService.create(body);
    }
    updatePrice(org, id, body) {
        return this.productPriceService.update(id, body);
    }
    deletePrice(org, id) {
        return this.productPriceService.delete(id);
    }
    getPrice(org, id) {
        return this.productPriceService.getOne({
            id,
            org: org
        });
    }
    getPrices(org, params) {
        params.organisation = org;
        return this.productPriceService.getMany({
            organisation: org
        });
    }
    constructor(productService, productTypesService, productPriceService){
        this.productService = productService;
        this.productTypesService = productTypesService;
        this.productPriceService = productPriceService;
    }
};
_ts_decorate([
    (0, _common.Post)(':org/products') // TODO: Mini thing, should we use plural or singular?
    ,
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _productsdto.ProductDto === "undefined" ? Object : _productsdto.ProductDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], ProductsController.prototype, "createProduct", null);
_ts_decorate([
    (0, _common.Patch)(':org/products/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        typeof _productsdto.ProductDto === "undefined" ? Object : _productsdto.ProductDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], ProductsController.prototype, "updateProduct", null);
_ts_decorate([
    (0, _common.Delete)(':org/products/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], ProductsController.prototype, "deleteProduct", null);
_ts_decorate([
    (0, _common.Get)(':org/products/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], ProductsController.prototype, "getProduct", null);
_ts_decorate([
    (0, _common.Get)(':org/products'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _paginationAndSortingdto.StandardFilterDto === "undefined" ? Object : _paginationAndSortingdto.StandardFilterDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], ProductsController.prototype, "getProducts", null);
_ts_decorate([
    (0, _common.Get)(':org/product-types/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], ProductsController.prototype, "getProductType", null);
_ts_decorate([
    (0, _common.Post)(':org/product-types') // TODO: Mini thing, should we use plural or singular?
    ,
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _productsdto.ProductTypeDto === "undefined" ? Object : _productsdto.ProductTypeDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], ProductsController.prototype, "createProductType", null);
_ts_decorate([
    (0, _common.Patch)(':org/product-types/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        typeof _productsdto.ProductTypeDto === "undefined" ? Object : _productsdto.ProductTypeDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], ProductsController.prototype, "updateProductType", null);
_ts_decorate([
    (0, _common.Delete)(':org/product-types/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], ProductsController.prototype, "deleteProductType", null);
_ts_decorate([
    (0, _common.Get)(':org/product-types'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _paginationAndSortingdto.StandardFilterDto === "undefined" ? Object : _paginationAndSortingdto.StandardFilterDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], ProductsController.prototype, "getProductTypes", null);
_ts_decorate([
    (0, _common.Post)(':org/prices') // TODO: Mini thing, should we use plural or singular?
    ,
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _productsdto.PriceDto === "undefined" ? Object : _productsdto.PriceDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], ProductsController.prototype, "createPrice", null);
_ts_decorate([
    (0, _common.Patch)(':org/prices/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        typeof _productsdto.PriceDto === "undefined" ? Object : _productsdto.PriceDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], ProductsController.prototype, "updatePrice", null);
_ts_decorate([
    (0, _common.Delete)(':org/prices/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], ProductsController.prototype, "deletePrice", null);
_ts_decorate([
    (0, _common.Get)(':org/prices/:id'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], ProductsController.prototype, "getPrice", null);
_ts_decorate([
    (0, _common.Get)(':org/prices'),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _paginationAndSortingdto.StandardFilterDto === "undefined" ? Object : _paginationAndSortingdto.StandardFilterDto
    ]),
    _ts_metadata("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], ProductsController.prototype, "getPrices", null);
ProductsController = _ts_decorate([
    (0, _common.Controller)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _productsservice.ProductsService === "undefined" ? Object : _productsservice.ProductsService,
        typeof _productTypesservice.ProductTypesService === "undefined" ? Object : _productTypesservice.ProductTypesService,
        typeof _productPriceservice.ProductPriceService === "undefined" ? Object : _productPriceservice.ProductPriceService
    ])
], ProductsController);
