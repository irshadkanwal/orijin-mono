"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    AbstractPriceDto: function() {
        return AbstractPriceDto;
    },
    AbstractProduct: function() {
        return AbstractProduct;
    },
    AbstractProductTypeDto: function() {
        return AbstractProductTypeDto;
    },
    PriceDto: function() {
        return PriceDto;
    },
    PriceDtoConnected: function() {
        return PriceDtoConnected;
    },
    PriceDtoCsv: function() {
        return PriceDtoCsv;
    },
    ProductDto: function() {
        return ProductDto;
    },
    ProductDtoConnected: function() {
        return ProductDtoConnected;
    },
    ProductDtoCsv: function() {
        return ProductDtoCsv;
    },
    ProductTypeDto: function() {
        return ProductTypeDto;
    },
    ProductTypeDtoConnected: function() {
        return ProductTypeDtoConnected;
    },
    ProductTypeDtoCsv: function() {
        return ProductTypeDtoCsv;
    }
});
const _classvalidator = require("class-validator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AbstractProduct = class AbstractProduct {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], AbstractProduct.prototype, "shortCode", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], AbstractProduct.prototype, "name", void 0);
let ProductDtoCsv = class ProductDtoCsv extends AbstractProduct {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], ProductDtoCsv.prototype, "organisation", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], ProductDtoCsv.prototype, "productTypeCode", void 0);
let ProductDto = class ProductDto extends AbstractProduct {
};
let ProductDtoConnected = class ProductDtoConnected extends AbstractProduct {
};
let AbstractProductTypeDto = class AbstractProductTypeDto {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], AbstractProductTypeDto.prototype, "shortCode", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], AbstractProductTypeDto.prototype, "name", void 0);
let ProductTypeDtoCsv = class ProductTypeDtoCsv extends AbstractProductTypeDto {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], ProductTypeDtoCsv.prototype, "organisation", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], ProductTypeDtoCsv.prototype, "cropCode", void 0);
let ProductTypeDto = class ProductTypeDto extends AbstractProductTypeDto {
};
_ts_decorate([
    (0, _classvalidator.ValidateIf)((dto)=>typeof dto.cropCode === 'undefined' || dto.cropId && dto.cropCode),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], ProductTypeDto.prototype, "cropId", void 0);
_ts_decorate([
    (0, _classvalidator.ValidateIf)((dto)=>typeof dto.cropId === 'undefined' || dto.cropId && dto.cropCode),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], ProductTypeDto.prototype, "cropCode", void 0);
let ProductTypeDtoConnected = class ProductTypeDtoConnected extends ProductTypeDto {
};
let AbstractPriceDto = class AbstractPriceDto {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], AbstractPriceDto.prototype, "unit", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], AbstractPriceDto.prototype, "perAmountUnit", void 0);
let PriceDtoCsv = class PriceDtoCsv extends AbstractPriceDto {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], PriceDtoCsv.prototype, "organisation", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], PriceDtoCsv.prototype, "shortCode", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], PriceDtoCsv.prototype, "amount", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], PriceDtoCsv.prototype, "perAmountAmount", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], PriceDtoCsv.prototype, "productCode", void 0);
let PriceDto = class PriceDto extends AbstractPriceDto {
};
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", Number)
], PriceDto.prototype, "amount", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", Number)
], PriceDto.prototype, "perAmountAmount", void 0);
let PriceDtoConnected = class PriceDtoConnected extends PriceDto {
};
